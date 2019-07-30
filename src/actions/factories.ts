import {
  Action,
  ActionCreator,
  ActionCreatorBundle,
  ActionFunction,
  ActionMatcher,
  AsyncActionCreators,
  Failure,
  Meta,
  Success,
  TypedAction,
} from './interfaces';

/**
 * Utilities
 */
const collapseType = (...types: string[]) =>
  types.length > 0 ? types.join('/') : 'UNKNOWN_TYPE';

/**
 * Action Combinators
 */
const matcherFactory = <P, M>(type: string): ActionMatcher<P, M> => ({
  match: (action: TypedAction): action is Action<P, M> => action.type === type,
});

const typeFactory = (...types: string[]): TypedAction => ({
  type: collapseType(...types),
});

const actionFactory = <P, M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error = false
): ActionFunction<P, M> =>
  ((payload: P, meta: M) => ({
    type,
    error,
    meta: { ...commonMeta, ...meta },
    payload,
  })) as ActionFunction<P, M>;

/**
 * General action creator factory
 *
 * @since 5.0.0
 */
export const actionCreator = <P, M extends Meta = Meta>(
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
export const asyncActionCreators = <P, R, E, M extends Meta = Meta>(
  group: string,
  commonMeta?: M
): AsyncActionCreators<P, R, E, M> => ({
  pending: actionCreator<P, M>(collapseType(group, 'PENDING'), commonMeta),
  failure: actionCreator<Failure<P, E>, M>(
    collapseType(group, 'FAILURE'),
    commonMeta,
    true
  ),
  success: actionCreator<Success<P, R>, M>(
    collapseType(group, 'SUCCESS'),
    commonMeta
  ),
});

/**
 * General action group creator (wraps other action creators into a group)
 *
 * @since 5.0.0
 */
export const actionCreatorFactory = <M extends Meta = Meta>(
  group: string,
  groupMeta?: M
): ActionCreatorBundle<M> => {
  const simple = <P, M2 extends Meta = Meta>(
    type: string,
    defaultMeta?: M2,
    error = false
  ) =>
    actionCreator<P, M & M2>(
      collapseType(group, type),
      Object.assign({}, groupMeta, defaultMeta),
      error
    );

  const async = <P, R, E, M2 extends Meta>(type: string, defaultMeta?: M2) =>
    asyncActionCreators<P, R, E, M & M2>(
      collapseType(group, type),
      Object.assign({}, groupMeta, defaultMeta)
    );

  return {
    simple,
    async,
  };
};
