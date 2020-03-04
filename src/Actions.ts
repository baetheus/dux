/**
 * @since 5.0.0
 *
 * Actions types and action factories
 */

/**
 * The bare minimum interface for actions in the dux system.
 * If your existing store doesn't have actions with a type parameter
 * that you can switch on then dux won't work (at least with typescript).
 *
 * @since 5.0.0
 */
export interface TypedAction {
  readonly type: string;
}

/**
 * Interface for metadata.
 *
 * @since 5.0.0
 */
export type Meta = Record<string, any>;

/**
 * Interface for FSA Action.
 *
 * @since 5.0.0
 */
export interface Action<P, M extends Meta = Meta> extends TypedAction {
  readonly value: P;
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
 * Interface for action matcher property
 *
 * @since 5.0.0
 */
type ActionMatcher<P, M> = {
  readonly match: (action: TypedAction) => action is Action<P, M>;
};

/**
 * Interface for action creator function
 *
 * @since 5.0.0
 */
type ActionFunction<P, M extends Meta = Meta> = (payload: P, meta?: M) => Action<P, M>;

/**
 * Interface for action creator intersection
 *
 * @since 5.0.0
 */
export type ActionCreator<P = unknown, M extends Meta = Meta> = TypedAction &
  ActionMatcher<P, M> &
  ActionFunction<P, M>;

/**
 * Extract an Action type from an ActionCreator
 *
 * @since 8.0.0
 */
export type ExtractAction<T> = T extends ActionCreator<infer P, infer M>[]
  ? Action<P, M>
  : Action<unknown, Meta>;

/**
 * Interface for async action creator
 *
 * @since 5.0.0
 */
export interface AsyncActionCreators<P = unknown, R = unknown, E = unknown, M extends Meta = Meta> {
  readonly pending: ActionCreator<P, M>;
  readonly success: ActionCreator<Success<P, R>, M>;
  readonly failure: ActionCreator<Failure<P, E>, M>;
}

/**
 * Interface for the action creator bundle.
 *
 * @since 5.0.0
 */
type ActionCreatorBundle<G extends string, M extends Meta = Meta> = {
  simple: <P = unknown, M2 extends Meta = Meta>(
    type: string,
    meta?: M2,
    error?: boolean
  ) => ActionCreator<P, M2 & Partial<M>>;
  async: <P = unknown, R = unknown, E = unknown, M2 extends Meta = Meta>(
    type: string,
    meta?: M2
  ) => AsyncActionCreators<P, R, E, M2 & Partial<M>>;
  group: G;
};

/**
 * @since 5.0.0
 */
export const collapseType = (...types: string[]) =>
  types.length > 0 ? types.join("/") : "UNKNOWN_TYPE";

const matcherFactory = <P, M>(type: string): ActionMatcher<P, M> => ({
  match: (action: TypedAction): action is Action<P, M> => action.type === type
});

const typeFactory = (...types: string[]): TypedAction => ({
  type: collapseType(...types)
});

/**
 * The simplest way to create an action.
 * Generally, for all but the simplest of applications, using
 * actionCreatorsFactory is a better move.
 *
 * @since 7.0.0
 */
export const actionFactory = <P, M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error = false
): ActionFunction<P, M> =>
  ((value: P, meta: M) => ({
    type,
    error,
    meta: { ...commonMeta, ...meta },
    value
  })) as ActionFunction<P, M>;

/**
 * General action creator factory
 *
 * @since 5.0.0
 */
const actionCreator = <P, M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error = false
): ActionCreator<P, M> =>
  Object.assign(
    actionFactory<P, M>(type, commonMeta, error),
    typeFactory(type),
    matcherFactory<P, M>(type)
  );

/**
 * Async action creator factory
 *
 * @since 5.0.0
 */
const asyncActionsCreator = <P, R, E, M extends Meta = Meta>(
  group: string,
  commonMeta?: M
): AsyncActionCreators<P, R, E, M> => ({
  pending: actionCreator<P, M>(collapseType(group, "PENDING"), commonMeta),
  failure: actionCreator<Failure<P, E>, M>(collapseType(group, "FAILURE"), commonMeta, true),
  success: actionCreator<Success<P, R>, M>(collapseType(group, "SUCCESS"), commonMeta)
});

/**
 * General action group creator (wraps other action creators into a group)
 *
 * @since 5.0.0
 */
export const actionCreatorFactory = <G extends string, M extends Meta = Meta>(
  group: G,
  groupMeta?: M
): ActionCreatorBundle<G, M> => {
  const simple = <P, M2 extends Meta = Meta>(type: string, defaultMeta?: M2, error = false) =>
    actionCreator<P, Partial<M> & M2>(
      collapseType(group, type),
      Object.assign({}, groupMeta, defaultMeta),
      error
    );

  const async = <P, R, E, M2 extends Meta>(type: string, defaultMeta?: M2) =>
    asyncActionsCreator<P, R, E, Partial<M> & M2>(
      collapseType(group, type),
      Object.assign({}, groupMeta, defaultMeta)
    );

  return {
    simple,
    async,
    group
  };
};
