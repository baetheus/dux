/**
 * @since 8.0.0
 *
 * The @nll/dux store operates like redux with redux-observable.
 */

import { Reducer, caseFn, reducerFn } from "./Reducers";
import { TypedAction, actionCreatorFactory, ActionCreator } from "./Actions";
import { Epic } from "./Epics";
import {
  BehaviorSubject,
  EMPTY,
  from,
  isObservable,
  merge,
  Observable,
  of,
  Subject
} from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  scan,
  share,
  takeUntil,
  withLatestFrom
} from "rxjs/operators";

/**
 * Utility Types and Functions.
 */
type Nil = undefined | null | void;
type Eq<S> = (a: S, b: S) => boolean;

const objEq = <T>(a: T, b: T): boolean => a === b;
const objEqC = <T>(a: T) => (b: T) => a === b;
const isIn = <T>(as: T[]) => (b: T) => as.some(objEqC(b));
const isNotIn = <T>(as: T[]) => (b: T) => !isIn(as)(b);
const isNotNil = <T>(t: T | Nil): t is T => t !== undefined && t !== null;

/**
 * The store API.
 *
 * @since 8.0.0
 */
export type StoreApi<S> = {
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
 * Internal store structure.
 */
type InternalState<S> = {
  reducers: Reducer<S>[];
  metaReducers: MetaReducer<S>[];
  epics: Epic<S>[];
};

/**
 * A stub to get state type into default internal state.
 */
const createInternalState = <S>(): InternalState<S> => ({
  reducers: [],
  metaReducers: [],
  epics: []
});

/**
 * Creates actions and a reducer for internal state events.
 */
const setupInternalState = <S>(name: string) => {
  const { simple } = actionCreatorFactory(name);

  const initialize = simple("INITIALIZE");
  const addReducers = simple<Reducer<S>[]>("ADD_REDUCERS");
  const removeReducers = simple<Reducer<S>[]>("REMOVE_REDUCERS");
  const addMetaReducers = simple<MetaReducer<S>[]>("ADD_METAREDUCERS");
  const removeMetaReducers = simple<MetaReducer<S>[]>("REMOVE_METAREDUCERS");
  const addEpics = simple<Epic<S>[]>("ADD_EPICS");
  const removeEpics = simple<Epic<S>[]>("REMOVE_EPICS");

  const internalState = createInternalState<S>();

  const reducer = reducerFn<InternalState<S>>(
    caseFn(addReducers, (s, { value }) => ({
      ...s,
      reducers: s.reducers.concat(value)
    })),
    caseFn(removeReducers, (s, { value }) => ({
      ...s,
      reducers: s.reducers.filter(isNotIn(value))
    })),
    caseFn(addMetaReducers, (s, { value }) => ({
      ...s,
      metaReducers: s.metaReducers.concat(value)
    })),
    caseFn(removeMetaReducers, (s, { value }) => ({
      ...s,
      metaReducers: s.metaReducers.filter(isNotIn(value))
    })),
    caseFn(addEpics, (s, { value }) => ({
      ...s,
      epics: s.epics.concat(value)
    })),
    caseFn(removeEpics, (s, { value }) => ({
      ...s,
      epics: s.epics.filter(isNotIn(value))
    }))
  );

  return {
    addReducers,
    removeReducers,
    addMetaReducers,
    removeMetaReducers,
    addEpics,
    removeEpics,
    initialize,
    reducer,
    internalState
  };
};

/**
 * To reduce stack size, reducers and metareducers are iterated over instead of
 * called recursively. This function takes an instance of internal state and
 * returns the single reducer that is used when computing state.
 */
const combineReducers = <S>({
  reducers,
  metaReducers
}: InternalState<S>): Reducer<S> => {
  const reducer: Reducer<S> = (s, a) => reducers.reduce((_s, r) => r(_s, a), s);
  return metaReducers.reduce((r, m) => m(r), reducer);
};

type InternalEpic<S> = (
  state: S,
  action: TypedAction,
  state$: Observable<S>,
  actions$: Observable<TypedAction>
) => Observable<TypedAction>;

/**
 * Maps all epic responses into observables. Handles returning rejected
 * promises and erroring observables. Filters null responses.
 */
const wrapEpic = <S>(
  state: S,
  action: TypedAction,
  state$: Observable<S>,
  actions$: Observable<TypedAction>
) => (epic: Epic<S>): Observable<TypedAction> =>
  from(
    Promise.resolve(epic(state, action, state$, actions$)).catch(error => {
      console.error("Epic returned a rejected promise.", {
        state,
        action,
        epic,
        error
      });
      return EMPTY;
    })
  ).pipe(
    mergeMap(result => (isObservable(result) ? result : of(result))),
    catchError(error => {
      console.error("Epic returned an observable that errored.", {
        state,
        action,
        epic,
        error
      });
      return EMPTY;
    }),
    filter(isNotNil)
  );

/**
 * Creates an observable that emits on REMOVE_EPICS events that match the given Epic
 */
const createEpicTakeUntil = <S>(
  epic: Epic<S>,
  { match }: ActionCreator<Epic<S>[]>,
  actions$: Observable<TypedAction>
) =>
  actions$.pipe(
    filter(match),
    filter(({ value }) => isIn(value)(epic))
  );

/**
 * This function, similar to combineReducers, takes an instance of internal state and
 * returns an Epic that iterates over epics. Each created epic listens for the remove
 * epic action and unsubscribes when it happens.
 */
const combineEpics = <S>(
  actionCreator: ActionCreator<Epic<S>[]>,
  internalActions$: Observable<TypedAction>
) => ({ epics }: InternalState<S>): InternalEpic<S> => (
  state,
  action,
  state$,
  actions$
) =>
  merge(
    ...epics.map(epic =>
      wrapEpic(
        state,
        action,
        state$,
        actions$
      )(epic).pipe(
        takeUntil(createEpicTakeUntil(epic, actionCreator, internalActions$))
      )
    )
  );

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
export const createStore = <S>(state: S, name = "DEFAULT") => {
  // Create InternalState reducers and actions
  const { internalState, reducer, ...actions } = setupInternalState<S>(name);
  const action: TypedAction = actions.initialize();

  /**
   * Setup internal structure
   */
  const stateS = new BehaviorSubject(state);
  const actionsS = new Subject<TypedAction>();
  const actions$ = actionsS.pipe(share());
  const internalActionsS = new BehaviorSubject(action);
  const internal$ = internalActionsS.pipe(
    scan(reducer, internalState),
    share()
  );

  /**
   * Pull reducer and epic out of internal state
   */
  const reducer$ = internal$.pipe(map(combineReducers));
  const epic$ = internal$.pipe(
    map(combineEpics(actions.removeEpics, internalActionsS))
  );

  /**
   * Wire up actions and epics
   */
  const store$ = actionsS.pipe(
    withLatestFrom(reducer$),
    scan(
      ({ state }, [action, reducer]) => ({
        state: reducer(state, action),
        action
      }),
      { state, action }
    ),
    share()
  );
  const state$ = store$.pipe(
    map(({ state }) => state),
    distinctUntilChanged(objEq),
    share()
  );
  const applyEpic$ = store$.pipe(
    withLatestFrom(epic$),
    mergeMap(([{ state, action }, epic]) =>
      epic(state, action, state$, actions$)
    )
  );

  /**
   * Setup epic loop and state behavior subject.
   */
  const stateSub = state$.subscribe(stateS);
  const epicSub = applyEpic$.subscribe(actionsS);

  /**
   * External API
   */
  const store: StoreApi<S> = {
    addReducers: (...reducers) => {
      internalActionsS.next(actions.addReducers(reducers));
      return store;
    },
    removeReducers: (...reducers) => {
      internalActionsS.next(actions.removeReducers(reducers));
      return store;
    },
    addMetaReducers: (...metaReducers) => {
      internalActionsS.next(actions.addMetaReducers(metaReducers));
      return store;
    },
    removeMetaReducers: (...metaReducers) => {
      internalActionsS.next(actions.removeMetaReducers(metaReducers));
      return store;
    },
    addEpics: (...epics) => {
      internalActionsS.next(actions.addEpics(epics));
      return store;
    },
    removeEpics: (...epics) => {
      internalActionsS.next(actions.removeEpics(epics));
      return store;
    },
    select: (selector, predicate = objEq) =>
      stateS.pipe(map(selector), distinctUntilChanged(predicate)),
    dispatch: (...as) => as.forEach(a => actionsS.next(a)),
    destroy: () => {
      epicSub.unsubscribe();
      stateSub.unsubscribe();
    }
  };

  return store;
};
