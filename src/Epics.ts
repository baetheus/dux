/**
 * The Epics module contains tools relating to side effects of a store. This includes things
 * like chaining on action from another, making an api request and returning an action on
 * response, etc.
 *
 * @since 8.0.0
 */

import { TypedAction, AsyncActionCreators } from "./Actions";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

type Nil = undefined | null | void;

/**
 * An Epic encapsulates side effects or temporal changes for the store.
 * It is given access to the current action and state, the action and
 * state observables, and may return nothing, an action, a promise that
 * contains an action, or an observable of actions.
 *
 * @example
 * import { Epic } from "../../src/Epics";
 *
 * export const loggingEpic: Epic<any> = (action, state) => {
 *     console.log(`State after ${action.type} reduced:`, { state, action });
 * }
 *
 * @since 8.0.0
 */
export type Epic<S> = (
  state: S,
  action: TypedAction,
  state$: Observable<S>,
  actions$: Observable<TypedAction>
) =>
  | Observable<TypedAction | Nil>
  | Promise<TypedAction | Nil>
  | TypedAction
  | Nil;

/**
 * Construct an Epic from an AsyncActionCreator and a projection function.
 * The projection function recieves the parameters of the pending action
 * and must return an observable of the result type.
 *
 * @since 8.0.0
 */
export const fromAsyncAction = <P, R, E, M, S>(
  ac: AsyncActionCreators<P, R, E, M>,
  project: (params: P) => Observable<R>
): Epic<S> => (_, action) => {
  if (ac.pending.match(action)) {
    return project(action.value).pipe(
      map(result => ac.success({ params: action.value, result }, action.meta)),
      catchError(error =>
        of(ac.failure({ params: action.value, error }, action.meta))
      )
    );
  }
};
