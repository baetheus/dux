/**
 * A collection of rxjs operators specific to working with observabled of actions.
 *
 * @since 8.0.0
 */

import { Observable, of, from } from "rxjs";
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap
} from "rxjs/operators";

import {
  AsyncActionCreators,
  Meta,
  TypedAction,
  ActionCreator,
  Action,
  ExtractAction
} from "./Actions";

/**
 * Takes a lettable map operator and creates asyncMap operator
 *
 * @since 5.0.0
 */
const asyncMapFactory = (mapper: typeof mergeMap) => <P, R, E, M extends Meta>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P, meta: M) => Observable<R>
) => (obs: Observable<TypedAction>) =>
  obs.pipe(
    filter(action.pending.match),
    mapper(({ value: params, meta }) =>
      project(params, meta).pipe(
        map(result => action.success({ params, result }, meta)),
        catchError(error => of(action.failure({ params, error }, meta)))
      )
    )
  );

/**
 * Wraps an asyncAction in a concatMap
 *
 * @since 5.0.0
 */
export const asyncConcatMap = asyncMapFactory(concatMap);

/**
 * Wraps an asyncAction in an exhaustMap
 *
 * @since 5.0.0
 */
export const asyncExhaustMap = asyncMapFactory(exhaustMap);

/**
 * Wraps an asyncAction in a mergeMap
 *
 * @since 5.0.0
 */
export const asyncMergeMap = asyncMapFactory(mergeMap);

/**
 * Wraps an asyncAction in a switchMap
 *
 * @since 5.0.0
 */
export const asyncSwitchMap = asyncMapFactory(switchMap);

/**
 * Filters on an action and a projection, and merges the output
 * of the projection with the original action.
 *
 * ie. originalAction => [originalAction, ...project(originalAction)]
 *
 * @since 5.0.0
 */
export const mapAction = <P, M extends Meta>(
  action: ActionCreator<P, M>,
  project: (action: Action<P, M>) => Action<any, any>[]
) => (obs: Observable<Action<any, any>>) =>
  obs.pipe(mergeMap(a => (action.match(a) ? from([a, ...project(a)]) : of(a))));

/**
 * RxJS operator to filter acitons by multiple `ActionCreator`s.
 * @param actions The `ActionCreator`s to match against the actions.
 *
 * @since 5.0.0
 */
export const filterActions: FilterActions = (...actions: ActionCreator<any, any>[]) => {
  const predicate = (a: TypedAction): a is Action<unknown> => actions.some(({ match }) => match(a));
  return filter(predicate);
};

/**
 * Interface for the filterActions operator.
 *
 * @since 5.0.0
 */
export interface FilterActions {
  <P1, M1>(a1: ActionCreator<P1, M1>): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1>>;
  <P1, M1, P2, M2>(a1: ActionCreator<P1, M1>, a2: ActionCreator<P2, M2>): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1> | Action<P2, M2>>;
  <P1, M1, P2, M2, P3, M3>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>
  ): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3>>;
  <P1, M1, P2, M2, P3, M3, P4, M4>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>
  ): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4>>;
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>
  ): (
    source: Observable<TypedAction>
  ) => Observable<
    Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4> | Action<P5, M5>
  >;
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5, P6, M6>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>
  ): (
    source: Observable<TypedAction>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
    | Action<P6, M6>
  >;
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5, P6, M6, P7, M7>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>
  ): (
    source: Observable<TypedAction>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
    | Action<P6, M6>
    | Action<P7, M7>
  >;
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5, P6, M6, P7, M7, P8, M8>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>,
    a8: ActionCreator<P8, M8>
  ): (
    source: Observable<TypedAction>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
    | Action<P6, M6>
    | Action<P7, M7>
    | Action<P8, M8>
  >;
  <A extends ActionCreator<any, any>[]>(...as: A): (
    source: Observable<TypedAction>
  ) => Observable<ExtractAction<A>>;
}
