/**
 * Utility functions for filtering and combining reducers
 *
 * @since 5.0.0
 */

import { DatumEither, failure, initial, success, toRefresh } from "@nll/datum/DatumEither";
import { Lens } from "monocle-ts/es6";

import {
  Action,
  ActionCreator,
  AsyncActionCreators,
  ExtractAction,
  Meta,
  TypedAction
} from "./Actions";

/**
 * Reducer Interface
 *
 * @since 5.0.0
 */
export type Reducer<S, A extends TypedAction = TypedAction> = (s: S, a: A) => S;

/**
 * Case function matches ActionCreator to Reducer.
 *
 * @since 5.0.0
 */
export const caseFn = <S, P, M>(
  action: ActionCreator<P, M>,
  reducer: Reducer<S, Action<P, M>>
): Reducer<S, TypedAction> => (s, a) => (action.match(a) ? reducer(s, a) : s);

/**
 * Case function matches multiple ActionCreators to a Reducer.
 *
 * @since 5.0.0
 */
export const casesFn = <S, A extends ActionCreator<any, any>[]>(
  actionCreators: A,
  reducer: Reducer<S, ExtractAction<A>>
): Reducer<S, TypedAction> => (s, a) =>
  actionCreators.some(({ match }) => match(a)) ? reducer(s, <ExtractAction<A>>a) : s;

/**
 * Compose caseFn and casesFn.
 *
 * @since 5.0.0
 */
export const reducerFn = <S>(...cases: Array<Reducer<S, TypedAction>>): Reducer<S, TypedAction> => (
  state,
  action
) => cases.reduce((s, r) => r(s, action), state);

/**
 * Compose caseFn and casesFn with initial state.
 *
 * @since 5.0.0
 */
export const reducerDefaultFn = <S>(
  initialState: S,
  ...cases: Array<Reducer<S, TypedAction>>
): Reducer<S | undefined, TypedAction> => (state = initialState, action) =>
  cases.reduce((s, r) => r(s, action), state);

type AsyncReducerFactory = <P, R, E, M, S>(
  a: AsyncActionCreators<P, R, E, Meta>,
  l: Lens<S, DatumEither<E, R>>
) => Reducer<S, TypedAction>;

/**
 * Generate a reducer that wraps a single DatumEither store value
 *
 * @since 5.0.0
 */
export const asyncReducerFactory: AsyncReducerFactory = (action, lens) =>
  reducerFn(
    caseFn(action.pending, lens.modify(toRefresh)),
    caseFn(action.success, (s, a) => lens.set(success(a.value.result))(s)),
    caseFn(action.failure, (s, a) => lens.set(failure(a.value.error))(s))
  );

type AsyncEntityFactory = <P, R, E, S>(
  a: AsyncActionCreators<P, R, E, Meta>,
  l: Lens<S, Record<string, DatumEither<E, R>>>,
  i: Lens<P, string>
) => Reducer<S, TypedAction>;

const composeRecord = <S, T, K extends keyof T>(lens: Lens<S, T>, def: T[K]) => (id: K) =>
  lens.compose(Lens.fromNullableProp<T>()(id, def));

/**
 * Generate a reducer that handles a record of multiple DatumEither store values
 *
 * @since 5.0.0
 */
export const asyncEntityFactory: AsyncEntityFactory = (action, lens, toId) => {
  const idLens = composeRecord(lens, initial);
  return reducerFn(
    caseFn(action.pending, (s, a) => idLens(toId.get(a.value)).modify(toRefresh)(s)),
    caseFn(action.success, (s, a) =>
      idLens(toId.get(a.value.params)).set(success(a.value.result))(s)
    ),
    caseFn(action.failure, (s, a) =>
      idLens(toId.get(a.value.params)).set(failure(a.value.error))(s)
    )
  );
};

/**
 * Filters actions by first section of action type to bypass sections of the store
 *
 * @since 7.1.0
 */
export const filterReducer = <S, P>(
  match: string,
  reducer: Reducer<S, TypedAction>
): Reducer<S, TypedAction> => (state, action) =>
  action.type.startsWith(match) ? reducer(state, action) : state;
