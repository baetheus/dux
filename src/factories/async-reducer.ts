import { AsyncData, failure, pending, success } from '../async-data';
import { some } from 'fp-ts/lib/Option';
import { Lens } from 'monocle-ts';

import { AsyncActionCreators, Failure, Success } from '../actions';
import { caseFn, reducerFn } from '../reducers';

export const asyncReducerFactory = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, AsyncData<E, R>>
) => {
  const pendingReducer = (s: S, _: P) =>
    lens.modify(d => d.fold(o => pending(o), () => pending<E, R>(), v => pending(some(v))))(s);
  const successReducer = (s: S, { result }: Success<P, R>) => lens.modify(_ => success(result))(s);
  const failureReducer = (s: S, { error }: Failure<P, E>) => lens.modify(_ => failure(error))(s);

  return reducerFn(
    caseFn(action.pending, pendingReducer),
    caseFn(action.success, successReducer),
    caseFn(action.failure, failureReducer)
  );
};

export const asyncEntityReducer = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, Record<string, AsyncData<E, R>>>,
  toId: Lens<P, string>
) => {
  const idLens = (id: string) => lens.compose(Lens.fromNullableProp(id, pending<E, R>()));
  const pendingReducer = (s: S, payload: P) =>
    idLens(toId.get(payload)).modify(prev => prev.fold(o => pending(o), () => pending(), v => pending(some(v))))(s);
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
