/**
 * Interface for metadata.
 *
 * @since 5.0.0
 */
export type Meta = Readonly<object> & { readonly [key: string]: any };

/**
 * Interface for FSA Action.
 *
 * @since 5.0.0
 */
export interface Action<P, M extends Meta = Meta> {
  readonly type: string;
  readonly payload: P;
  readonly meta: M;
  readonly error: boolean;
}

/**
 * Interface for "Success" Action payload.
 *
 * @since 5.0.0
 */
export interface Success<P, R> {
  readonly params: P;
  readonly result: R;
}

/**
 * Interface for "Failure" Action payload.
 *
 * @since 5.0.0
 */
export interface Failure<P, E> {
  readonly params: P;
  readonly error: E;
}

/**
 * Interface for result actions
 *
 * @since 5.0.0
 */
export type ResultAction<P, R, E, M extends Meta> =
  | Action<Success<P, R>, M>
  | Action<Failure<P, E>, M>;

/**
 * Interface for an action type
 *
 * @since 5.0.0
 */
export interface TypedAction {
  readonly type: string;
}

/**
 * Interface for action matcher property
 *
 * @since 5.0.0
 */
export type ActionMatcher<P, M> = {
  readonly match: (action: Action<any, any>) => action is Action<P, M>;
};

/**
 * Interface for action creator function
 *
 * @since 5.0.0
 */
export type ActionFunction<P = void, M extends Meta = Meta> = P extends void
  ? (payload?: P, meta?: M) => Action<P, M>
  : (payload: P, meta?: M) => Action<P, M>;

/**
 * Interface for action creator intersection
 *
 * @since 5.0.0
 */
export type ActionCreator<P = void, M extends Meta = Meta> = TypedAction &
  ActionMatcher<P, M> &
  ActionFunction<P, M>;

/**
 * Interface for async action creator
 *
 * @since 5.0.0
 */
export interface AsyncActionCreators<
  P = void,
  R = void,
  E = void,
  M extends Meta = Meta
> {
  readonly pending: ActionCreator<P, M>;
  readonly success: ActionCreator<Success<P, R>, M>;
  readonly failure: ActionCreator<Failure<P, E>, M>;
}

/**
 * Interface for the action creator bundle.
 *
 * @since 5.0.0
 */
export type ActionCreatorBundle<M extends Meta = Meta> = {
  simple: <P = void, M2 extends Meta = Meta>(
    type: string,
    meta?: M2,
    error?: boolean
  ) => ActionCreator<P, M2 & M>;
  async: <P = void, R = void, E = void, M2 extends Meta = Meta>(
    type: string,
    meta?: M2
  ) => AsyncActionCreators<P, R, E, M2 & M>;
};

/**
 * Interface for an action creator factory
 *
 * @since 5.0.0
 */
export type ActionCreatorFactory = <M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error?: boolean
) => ActionCreatorBundle<M>;
