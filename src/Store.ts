/**
 * @since 8.0.0
 *
 * @todo
 * * Look into more obvious and useful error handling.
 *
 * The @nll/dux store operates like redux with redux-observable.
 */

import { Reducer } from "./Reducers";
import { TypedAction, ActionCreator, Action } from "./Actions";
import { BehaviorSubject, EMPTY, from, isObservable, Observable, of, Subject } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";

/**
 * Utility Types and Functions.
 */
const objEq = <T>(a: T, b: T): boolean => a === b;
const objEqC = <T>(a: T) => (b: T) => a === b;
const isIn = <T>(as: T[]) => (b: T) => as.some(objEqC(b));
const isNotIn = <T>(as: T[]) => (b: T) => !isIn(as)(b);
const isNotNil = <T>(t?: T | undefined | null | void): t is T => t !== undefined && t !== null;

/**
 * wrapEvery cleans up every responses
 * * Forces all everys to be async via Promise.resolve
 * * Catches any everys that sync output Promise.reject
 * * Filters null/undefined/void outputs
 * * Catches any observables that drop to error channel
 * * Filters null/undefined/void events in observables/promises
 */
const wrapEvery = <S>(
  state: S,
  action: TypedAction,
  every: RunEvery<S>
): Observable<TypedAction> => {
  let everyResult = Promise.resolve(every(state, action))
    .catch((_) => undefined)
    .then((res) => (isNotNil(res) ? res : EMPTY))
    .then((res) => (isObservable(res) ? res : of(res)));
  return from(everyResult).pipe(
    mergeAll(),
    catchError(() => EMPTY),
    filter(isNotNil)
  );
};

/**
 * wrapOnce cleans up once responses
 */
const wrapOnce = <S>(
  actions$: Observable<TypedAction>,
  state$: Observable<S>,
  once: RunOnce<S>
): Observable<TypedAction> => once(actions$, state$).pipe(catchError(() => EMPTY));

/**
 * A RunOnce function is called immediately after being added to the store.
 * It can only return an observable of actions. This observable need not every
 * emit an action. (So EMPTY and NEVER) are ok to return.
 *
 * @example
 * import { RunOnce } from "../../src/Store";
 * import { tap, withLatestFrom, mergeMapTo } from "rxjs/operators";
 * import { EMPTY } from "rxjs";
 *
 * export const logger: RunOnce<{}> = (actions$, state$) => actions$.pipe(
 *     withLatestFrom(state$),
 *     tap(([action, state]) =>
 *         console.log(`State after ${action.type} reduced:`, { state, action })
 *     ),
 *     mergeMapTo(EMPTY)
 * );
 *
 * @since 8.0.0
 */
export type RunOnce<S> = (
  actions$: Observable<TypedAction>,
  state$: Observable<S>
) => Observable<TypedAction>;

/**
 * A RunEvery function is called after every store reduction. It can return nothing,
 * an action, a promise that returns nothing or an action, or an observable of actions.
 *
 * To return multiple actions one can use an observable.
 *
 * @example
 * import { RunEvery } from "../../src/Store";
 * import { from } from "rxjs";
 *
 * export const logger: RunEvery<{}> = (state, action) => {
 *     console.log(`State after ${action.type} reduced:`, { state, action });
 * }
 *
 * export const chainMultipleActions: RunEvery<{}> = (state, action) => {
 *     if (action.type === 'MULTIPLE') {
 *         return from([
 *             { type: 'MULTI_1' },
 *             { type: 'MULTI_2' },
 *             { type: 'MULTI_3' },
 *         ]);
 *     }
 * }
 *
 * @since 8.0.0
 */
export type RunEvery<S, A extends TypedAction = TypedAction> = (
  state: S,
  action: A
) => Observable<TypedAction> | Promise<TypedAction | void> | TypedAction | void;

/**
 * A MetaReducer is a function that takes a reducer and returns a reducer. It's useful
 * for modifying or tracking the state before and after a reducer fires.
 *
 * @example
 * import { MetaReducer } from "../../src/Store";
 *
 * export const loggingMetaReducer: MetaReducer<any> = reducer => {
 *     return function loggingReducer(previousState, action) {
 *         const state = reducer(previousState, action);
 *         console.log(action.type, { previousState, state, action });
 *         return state;
 *     };
 * };
 *
 * @since 8.0.0
 */
export type MetaReducer<S> = (reducer: Reducer<S>) => Reducer<S>;

/**
 * A Selector narrows or modifies the state. It is effectively a lens into a particular
 * part of the state.
 *
 * @example
 * import { createStore } from "../../src/Store";
 *
 * const store = createStore({ count: 0 }).addReducers(
 *     (state, _) => ({ count: state.count + 1 })
 * );
 * store.select(state => state.count).subscribe(
 *     count => console.log(`New count is: ${count}`)
 * )
 * store.dispatch({ type: 'ANY_ACTION' });
 *
 * @since 8.0.0
 */
export type Selector<S, O> = (state: S) => O;

/**
 * The store API.
 *
 * @since 8.0.0
 */
export type Store<S> = {
  getState: () => S;
  setState: (s: S) => void;
  addReducers: (...reducers: Reducer<S>[]) => Store<S>;
  removeReducers: (...reducers: Reducer<S>[]) => Store<S>;
  addMetaReducers: (...metaReducers: MetaReducer<S>[]) => Store<S>;
  removeMetaReducers: (...metaReducers: MetaReducer<S>[]) => Store<S>;
  addRunEverys: (...everys: RunEvery<S>[]) => Store<S>;
  removeRunEverys: (...everys: RunEvery<S>[]) => Store<S>;
  addRunOnces: (...onces: RunOnce<S>[]) => Store<S>;
  removeRunOnces: (...onces: RunOnce<S>[]) => Store<S>;
  select: <O>(selector: Selector<S, O>, predicate?: (a: O, b: O) => boolean) => Observable<O>;
  dispatch: (...as: TypedAction[]) => void;
  destroy: () => void;
};

/**
 * While the redux pattern is powerful, it is also painful to instrument. This implementation
 * of the redux pattern combines redux-observable and a more flexible interface for adding
 * and removed reducers, metareducers(middleware), and epics.
 *
 * The ordering of events in a running store is very specific:
 * 1. A new action is received.
 * 2. MetaReducers are run in the order they were added.
 * 3. Reducers are run in the order they were added.
 * 4. Selectors are called in the order they were added.
 * 5. Epics are called in the order they were added.
 * 6. Actions that are emitted by Epics are pushed back into the queue.
 *
 * @example
 * import { createStore } from "../../src/Store";
 *
 * type State = {
 *     count: number
 * }
 * const initialState: State = { count: 0 };
 *
 * export const myStore = createStore(initialState);
 *
 * @since 8.0.0
 */
export const createStore = <S>(state: S): Store<S> => {
  const everyRemoval$ = new Subject<RunEvery<S>>();
  const onceRemoval$ = new Subject<RunOnce<S>>();
  const actions$ = new Subject<TypedAction>();
  const state$ = new BehaviorSubject(state);

  let metaReducers: MetaReducer<S>[] = [];
  let reducers: Reducer<S>[] = [];
  let everys: RunEvery<S>[] = [];
  let onces: RunOnce<S>[] = [];

  const runReducer: Reducer<S> = (state, action) => {
    const reducer: Reducer<S> = (s, a) => reducers.reduce((_s, r) => r(_s, a), s);
    const metaReducer = metaReducers.reduce((r, m) => m(r), reducer);
    return metaReducer(state, action);
  };

  const runEverys = (state: S, action: TypedAction): void => {
    everys.forEach((every) => {
      wrapEvery(state, action, every)
        .pipe(takeUntil(everyRemoval$.pipe(filter(objEqC(every)))))
        .subscribe(actions$);
    });
  };

  const runOnces = (onces: RunOnce<S>[]): void => {
    onces.forEach((once) => {
      wrapOnce(actions$, state$, once)
        .pipe(takeUntil(onceRemoval$.pipe(filter(objEqC(once)))))
        .subscribe(actions$);
    });
  };

  const run = (state: S, action: TypedAction): void => {
    const nextState = runReducer(state, action);
    state$.next(nextState);
    runEverys(nextState, action);
  };

  /**
   * Wireup State
   */
  const runSub = actions$
    .pipe(withLatestFrom(state$))
    .subscribe(([action, state]) => run(state, action));

  /**
   * External API
   *
   */
  const store: Store<S> = {
    getState: () => state$.getValue(),
    setState: (s) => state$.next(s),
    addReducers: (...rs) => {
      reducers = reducers.concat(rs);
      return store;
    },
    removeReducers: (...rs) => {
      reducers = reducers.filter(isNotIn(rs));
      return store;
    },
    addMetaReducers: (...mrs) => {
      metaReducers = metaReducers.concat(mrs);
      return store;
    },
    removeMetaReducers: (...mrs) => {
      metaReducers = metaReducers.filter(isNotIn(mrs));
      return store;
    },
    addRunEverys: (...es) => {
      everys = everys.concat(es);
      return store;
    },
    removeRunEverys: (...es) => {
      everys = everys.filter(isNotIn(es));
      es.forEach((every) => everyRemoval$.next(every));
      return store;
    },
    addRunOnces: (...os) => {
      onces = onces.concat(os);
      runOnces(os);
      return store;
    },
    removeRunOnces: (...os) => {
      onces = onces.filter(isNotIn(os));
      os.forEach((once) => onceRemoval$.next(once));
      return store;
    },
    select: (selector, predicate = objEq) =>
      state$.pipe(map(selector), distinctUntilChanged(predicate)),
    dispatch: (...as) => as.forEach((a) => actions$.next(a)),
    destroy: () => {
      runSub.unsubscribe();
      everys.forEach((every) => everyRemoval$.next(every));
      onces.forEach((once) => onceRemoval$.next(once));
      everyRemoval$.complete();
      onceRemoval$.complete();
      actions$.complete();
      state$.complete();
    },
  };

  return store;
};

/**
 * filterEvery is like a caseFn for a RunEvery. It takes an ActionCreator
 * from the Actions module and a RunEvery specific to that action. It will
 * only run the supplied RunEvery after the supplied action matches the
 * ActionCreator.
 *
 * @example
 * import { filterEvery } from "../../src/Store";
 * import { actionCreatorFactory } from "../../src/Actions";
 *
 * const { simple } = actionCreatorFactory("EXAMPLES");
 * const simpleAction = simple<number>("SIMPLE")
 *
 * export const runEverySimpleAction = filterEvery(
 *     simpleAction,
 *     (state: any, action) => console.log("Saw a simpleAction", { state, action })
 * );
 *
 * @since 8.2.0
 */
export const filterEvery = <S, P, M>(
  ac: ActionCreator<P, M>,
  fn: RunEvery<S, Action<P, M>>
): RunEvery<S> => (state, action) => {
  if (ac.match(action)) {
    return fn(state, action);
  }
};
