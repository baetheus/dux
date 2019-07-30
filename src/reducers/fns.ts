import { Action, ActionCreator, Meta } from '../actions/interfaces';
import { ActionReducer, CasesFn, Handler, ReducerFn } from './interfaces';

/**
 * Case function matches ActionCreator to handler.
 *
 * @since 5.0.0
 */
export const caseFn = <S, P, M extends Meta>(
  action: ActionCreator<P, M>,
  handler: Handler<S, P>
): ActionReducer<S, P, M> => (s: S, a: Action<P, M>) =>
  action.match(a) ? handler(s, a.payload) : s;

/**
 * Case function matches multiple ActionCreators to a handler.
 *
 * @since 5.0.0
 */
export const casesFn: CasesFn = <S>(
  actions: Array<ActionCreator<any, any>>,
  handler: Handler<S, any>
): ActionReducer<S, any, any> => (s: S, a: Action<any, any>) =>
  actions.some(({ match }) => match(a)) ? handler(s, a.payload) : s;

/**
 * Compose caseFn and casesFn.
 *
 * @since 5.0.0
 */
export const reducerFn: ReducerFn = <S>(
  ...cases: Array<ActionReducer<S, any, any>>
): ActionReducer<S, any, any> => (state: S, action: Action<any, any>) =>
  cases.reduce((s, r) => r(s, action), state);

/**
 * Compose caseFn and casesFn with initial state.
 *
 * @since 5.0.0
 */
export const reducerDefaultFn = <S>(
  initialState: S,
  ...cases: Array<ActionReducer<S, any, any>>
) => (state: S | undefined = initialState, action: Action<any, any>): S =>
  cases.reduce((s, r) => r(s, action), state);
