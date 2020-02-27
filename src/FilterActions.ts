/**
 * @since 5.0.0
 *
 * Pipeable observable operators for filtering
 */

import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { Action, ActionCreator, TypedAction, ExtractAction } from "./Actions";

/**
 * RxJS operator to filter acitons by multiple `ActionCreator`s.
 * @param actions The `ActionCreator`s to match against the actions.
 *
 * @since 5.0.0
 */
export const filterActions: FilterActions = (
  ...actions: ActionCreator<any, any>[]
) => {
  const predicate = (a: TypedAction): a is Action<unknown> =>
    actions.some(({ match }) => match(a));
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
  ) => Observable<
    Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4>
  >;
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>
  ): (
    source: Observable<TypedAction>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
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
