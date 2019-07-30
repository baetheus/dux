import { Lens } from 'monocle-ts';

import { AsyncActionCreators, Failure, Meta, Success } from '../actions';
import { AsyncData, failure, initial, pending, success } from '../async-data';
import { caseFn, reducerFn } from './fns';

/**
 * Generate a reducer that wraps a single AsyncData store value
 *
 * @since 5.0.0
 */
export const asyncReducerFactory = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, AsyncData<E, R>>
) => {
  const pendingReducer = (s: S, _: P) =>
    lens.modify(d =>
      d.fold(pending(), d, e => failure(e, true), d => success(d, true))
    )(s);
  const successReducer = (s: S, { result }: Success<P, R>) =>
    lens.modify(_ => success(result))(s);
  const failureReducer = (s: S, { error }: Failure<P, E>) =>
    lens.modify(_ => failure(error))(s);

  return reducerFn(
    caseFn(action.pending, pendingReducer),
    caseFn(action.success, successReducer),
    caseFn(action.failure, failureReducer)
  );
};

/**
 * Generate a reducer that handles a record of multiple AsyncData store values
 *
 * @since 5.0.0
 */
export const asyncEntityReducer = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, Record<string, AsyncData<E, R>>>,
  toId: Lens<P, string>
) => {
  const idLens = (id: keyof Record<string, AsyncData<E, R>>) =>
    lens.compose(
      Lens.fromNullableProp<Record<string, AsyncData<E, R>>>()(
        id,
        initial<E, R>()
      )
    );

  const pendingReducer = (s: S, payload: P) =>
    idLens(toId.get(payload)).modify(prev =>
      prev.fold(pending(), prev, e => failure(e, true), d => success(d, true))
    )(s);
  const successReducer = (s: S, { params, result }: Success<P, R>) =>
    idLens(toId.get(params)).modify(_ => success(result))(s);
  const failureReducer = (s: S, { params, error }: Failure<P, E>) =>
    idLens(toId.get(params)).modify(_ => failure(error))(s);

  return reducerFn(
    caseFn(action.pending, pendingReducer),
    caseFn(action.success, successReducer),
    caseFn(action.failure, failureReducer)
  );
};

/**
 * Generates factories an asyncReducerFactory and asyncEntityReducer from an action.
 *
 * @since 5.1.0
 */
export const asyncReducersFactory = <
  P = void,
  R = void,
  E = Error,
  M extends Meta = Meta
>(
  action: AsyncActionCreators<P, R, E, M>
) => ({
  reducer: <S>(lens: Lens<S, AsyncData<E, R>>) =>
    asyncReducerFactory(action, lens),
  entityReducer: <S>(
    lens: Lens<S, Record<string, AsyncData<E, R>>>,
    toId: Lens<P, string>
  ) => asyncEntityReducer(action, lens, toId),
});
