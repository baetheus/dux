/**
 * Interface for metadata.
 */
export type Meta = Readonly<object> & { readonly [key: string]: any };

/**
 * Interface for FSA Action.
 */
export interface Action<P, M extends Meta = Meta> {
  readonly type: string;
  readonly payload: P;
  readonly meta: M;
  readonly error: boolean;
}

/**
 * Interface for "Success" Action payload.
 */
export interface Success<P, R> {
  readonly params: P;
  readonly result: R;
}

/**
 * Interface for "Failure" Action payload.
 */
export interface Failure<P, E> {
  readonly params: P;
  readonly error: E;
}

/**
 * Interface for result actions
 */
export type ResultAction<P, R, E, M extends Meta> = Action<Success<P, R>, M> | Action<Failure<P, E>, M>;

/**
 * Interface for creating syncrconous actions.
 */
export interface ActionCreator<P, M extends Meta = Meta> {
  <M2 extends Meta = Meta>(payload: P, meta?: M2): Action<P, M & M2>;
  readonly type: string;
  readonly match: (action: Action<any, any>) => action is Action<P, M>;
}

// export interface EmptyActionCreator<M extends object> extends ActionCreator<void, M> {
//   <M2 extends object>(payload: void, meta?: M): Action<void, M & M2 & Meta>;
// }

/**
 * Interface for creating async actions.
 */
export interface AsyncActionCreators<P, R, E, M extends Meta = Meta> {
  readonly type: string;
  readonly pending: ActionCreator<P, M>;
  readonly success: ActionCreator<Success<P, R>, M>;
  readonly failure: ActionCreator<Failure<P, E>, M>;
}

/**
 * Interface for the action creator factory.
 */
export interface ActionCreatorFactory {
  <P = void, M extends Meta = Meta>(type: string, commonMeta?: M, error?: boolean): ActionCreator<P, M>;
  readonly async: <P, S, E, M extends Meta = Meta>(type: string, commonMeta?: M) => AsyncActionCreators<P, S, E, M>;
}
