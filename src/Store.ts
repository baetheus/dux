/**
 * @since 8.0.0
 *
 * The @nll/dux store operates like redux with redux-observable.
 */

import { Reducer } from "./Reducers";
import { TypedAction } from "./Actions";
import { Epic } from "./Epics";
import {
  BehaviorSubject,
  EMPTY,
  from,
  isObservable,
  Observable,
  of,
  Subject,
  Subscription
} from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  takeUntil,
  withLatestFrom
} from "rxjs/operators";

/**
 * Utility Types and Functions.
 */
type Eq<S> = (a: S, b: S) => boolean;

const objEq = <T>(a: T, b: T): boolean => a === b;
const objEqC = <T>(a: T) => (b: T) => a === b;
const isIn = <T>(as: T[]) => (b: T) => as.some(objEqC(b));
const isNotIn = <T>(as: T[]) => (b: T) => !isIn(as)(b);
const isNotNil = <T>(t?: T | undefined | null | void): t is T =>
  t !== undefined && t !== null;
const ON_ERROR = () => {};

/**
 * The store API.
 *
 * @since 8.0.0
 */
export type StoreApi<S> = {
  getState: () => S;
  setState: (s: S) => void;
  addReducers: (...reducers: Reducer<S>[]) => StoreApi<S>;
  removeReducers: (...reducers: Reducer<S>[]) => StoreApi<S>;
  addMetaReducers: (...metaReducers: MetaReducer<S>[]) => StoreApi<S>;
  removeMetaReducers: (...metaReducers: MetaReducer<S>[]) => StoreApi<S>;
  addEpics: (...epics: Epic<S>[]) => StoreApi<S>;
  removeEpics: (...epics: Epic<S>[]) => StoreApi<S>;
  select: <O>(selector: Selector<S, O>, predicate?: Eq<O>) => Observable<O>;
  dispatch: (...as: TypedAction[]) => void;
  destroy: () => void;
};

/**
 * wrapEpic cleans up epic responses
 * * Forces all epics to be async via Promise.resolve
 * * Catches any epics that sync output Promise.reject
 * * Filters null/undefined/void outputs
 * * Catches any observables that drop to error channel
 * * Filters null/undefined/void events in observables
 */
const wrapEpic = <S>(
  state: S,
  action: TypedAction,
  epic: Epic<S>,
  onError: (...e: unknown[]) => void
): Observable<TypedAction> => {
  let epicResult = Promise.resolve(epic(state, action))
    .catch(error => onError("Error on Promise.resolve", error))
    .then(res => (isNotNil(res) ? res : EMPTY))
    .then(res => (isObservable(res) ? res : of(res)));
  return from(epicResult).pipe(
    mergeAll(),
    catchError(error => {
      onError(error);
      return EMPTY;
    }),
    filter(isNotNil)
  );
};

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
export const createStore = <S>(
  state: S,
  onError: (...e: unknown[]) => void = ON_ERROR
): StoreApi<S> => {
  const state$ = new BehaviorSubject(state);
  const actions$ = new Subject<TypedAction>();
  const epicRemoval$ = new Subject<Epic<S>>();
  const subscriptions = new WeakSet<Subscription>();

  let epics: Epic<S>[] = [];
  let metaReducers: MetaReducer<S>[] = [];
  let reducers: Reducer<S>[] = [];

  const runReducer: Reducer<S> = (state, action) => {
    const reducer: Reducer<S> = (s, a) =>
      reducers.reduce((_s, r) => r(_s, a), s);
    return metaReducers.reduce((r, m) => m(r), reducer)(state, action);
  };

  const runEpics = (state: S, action: TypedAction): void => {
    epics.forEach(epic => {
      const epicReturn = wrapEpic(state, action, epic, onError);
      const epicSub = epicReturn
        .pipe(takeUntil(epicRemoval$.pipe(filter(objEqC(epic)))))
        .subscribe(next => actions$.next(next), onError);
      subscriptions.add(epicSub);
    });
  };

  const run = (state: S, action: TypedAction): void => {
    const nextState = runReducer(state, action);
    state$.next(nextState);
    runEpics(nextState, action);
  };

  /**
   * External API
   *
   */
  const store: StoreApi<S> = {
    getState: () => state$.getValue(),
    setState: s => state$.next(s),
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
    addEpics: (...es) => {
      epics = epics.concat(es);
      return store;
    },
    removeEpics: (...es) => {
      epics = epics.filter(isNotIn(es));
      es.forEach(epic => epicRemoval$.next(epic));
      return store;
    },
    select: (selector, predicate = objEq) =>
      state$.pipe(map(selector), distinctUntilChanged(predicate)),
    dispatch: (...as) => as.forEach(a => actions$.next(a)),
    destroy: () => {
      epicRemoval$.complete();
      actions$.complete();
      state$.complete();
    }
  };

  /**
   * Wireup State
   */
  subscriptions.add(
    actions$
      .pipe(withLatestFrom(state$))
      .subscribe(([action, state]) => run(state, action), onError)
  );

  return store;
};
