import { initial } from '@nll/datum/es6/Datum';
import { DatumEither, failure, success, toRefresh } from '@nll/datum/es6/DatumEither';
import { Lens } from 'monocle-ts';

import { AsyncActionCreators, Failure, Meta, Success } from '../actions';
import { caseFn, reducerFn } from './fns';

/**
 * Generate a reducer that wraps a single DatumEither store value
 *
 * @since 5.0.0
 */
export const asyncReducerFactory = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, DatumEither<E, R>>
) => {
  const pendingReducer = (s: S, _: P) => lens.modify(toRefresh)(s);
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
 * Generate a reducer that handles a record of multiple DatumEither store values
 *
 * @since 5.0.0
 */
export const asyncEntityReducer = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, Record<string, DatumEither<E, R>>>,
  toId: Lens<P, string>
) => {
  const idLens = (id: keyof Record<string, DatumEither<E, R>>) =>
    lens.compose(
      Lens.fromNullableProp<Record<string, DatumEither<E, R>>>()(id, initial)
    );

  const pendingReducer = (s: S, payload: P) =>
    idLens(toId.get(payload)).modify(toRefresh)(s);
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
  reducer: <S>(lens: Lens<S, DatumEither<E, R>>) =>
    asyncReducerFactory(action, lens),
  entityReducer: <S>(
    lens: Lens<S, Record<string, DatumEither<E, R>>>,
    toId: Lens<P, string>
  ) => asyncEntityReducer(action, lens, toId),
});
