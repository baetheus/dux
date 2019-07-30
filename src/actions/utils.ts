import { Action, ActionCreator, Meta } from './interfaces';

/**
 * Checks if the Action is from the ActionCreator.
 *
 * @since 5.0.0
 */
export const isType = <P, M extends Meta>(
  actionCreator: ActionCreator<P, M>
) => (action: Action<any, any>): action is Action<P, M> =>
  action.type === actionCreator.type;
