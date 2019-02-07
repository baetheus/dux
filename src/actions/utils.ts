import { Action, ActionCreator, Meta } from "./interfaces";

/**
 * Checks if the Action is from the ActionCreator.
 */
export const isType = <P, M extends Meta>(actionCreator: ActionCreator<P, M>) => (
  action: Action<any, any>,
): action is Action<P, M> => action.type === actionCreator.type;
