import { DatumEither, failure, initial, success, toRefresh } from '@nll/datum/lib/DatumEither';
import { Lens } from 'monocle-ts';

import { Action, ActionCreator, AsyncActionCreators, Failure, Meta, Success } from './Actions';

/**
 * Reducer Interface
 *
 * @since 5.0.0
 */
export type Reducer<S, I = void> = (s: S, r: I) => S;

/**
 * Success Reducer Interface
 *
 * @since 5.0.0
 */
export type ReducerSuccess<S, I, O> = (s: S, r: Success<I, O>) => S;

/**
 * Failure Reducer Interface
 *
 * @since 5.0.0
 */
export type ReducerFailure<S, I, O = Error> = (s: S, r: Failure<I, O>) => S;

/**
 * Action Reducer Interface
 *
 * @since 5.0.0
 */
export type ActionReducer<S, P, M extends Meta> = (
  state: S,
  action: Action<P, M>
) => S;

/**
 * Interface for action handler.
 *
 * @since 5.0.0
 */
export type Handler<S, P> = (state: S, payload: P) => S;

/**
 * Variadic interface for casesFn.
 *
 * @since 5.0.0
 */
export interface CasesFn {
  <S, P1>(
    actionCreator: [ActionCreator<P1, any>],
    handler: Handler<S, P1>
  ): ActionReducer<S, P1, any>;
  <S, P1, P2>(
    actionCreator: [ActionCreator<P1, any>, ActionCreator<P2, any>],
    handler: Handler<S, P1 | P2>
  ): ActionReducer<S, P1 | P2, any>;
  <S, P1, P2, P3>(
    actionCreator: [
      ActionCreator<P1, any>,
      ActionCreator<P2, any>,
      ActionCreator<P3, any>
    ],
    handler: Handler<S, P1 | P2 | P3>
  ): ActionReducer<S, P1 | P2 | P3, any>;
  <S, P1, P2, P3, P4>(
    actionCreator: [
      ActionCreator<P1, any>,
      ActionCreator<P2, any>,
      ActionCreator<P3, any>,
      ActionCreator<P4, any>
    ],
    handler: Handler<S, P1 | P2 | P3 | P4>
  ): ActionReducer<S, P1 | P2 | P3 | P4, any>;
  <S, P1, P2, P3, P4, P5>(
    actionCreator: [
      ActionCreator<P1, any>,
      ActionCreator<P2, any>,
      ActionCreator<P3, any>,
      ActionCreator<P4, any>,
      ActionCreator<P5, any>
    ],
    handler: Handler<S, P1 | P2 | P3 | P4 | P5>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5, any>;
  <S, P1, P2, P3, P4, P5, P6>(
    actionCreator: [
      ActionCreator<P1, any>,
      ActionCreator<P2, any>,
      ActionCreator<P3, any>,
      ActionCreator<P4, any>,
      ActionCreator<P5, any>,
      ActionCreator<P5, any>
    ],
    handler: Handler<S, P1 | P2 | P3 | P4 | P5 | P6>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6, any>;
  <S>(
    actionCreator: [ActionCreator<any, any>],
    handler: Handler<S, any>
  ): ActionReducer<S, any, any>;
}

/**
 * Variadic interface for reduceFn.
 *
 * @since 5.0.0
 */
export interface ReducerFn {
  <S>(): ActionReducer<S, void, any>;
  <S, P1>(c1: ActionReducer<S, P1, any>): ActionReducer<S, P1, any>;
  <S, P1, P2>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>
  ): ActionReducer<S, P1 | P2, any>;
  <S, P1, P2, P3>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>
  ): ActionReducer<S, P1 | P2 | P3, any>;
  <S, P1, P2, P3, P4>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4, any>;
  <S, P1, P2, P3, P4, P5>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5, any>;
  <S, P1, P2, P3, P4, P5, P6>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6, any>;
  <S, P1, P2, P3, P4, P5, P6, P7>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7, any>;
  <S, P1, P2, P3, P4, P5, P6, P7, P8>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8, any>;
  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9, any>;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10, any>;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>
  ): ActionReducer<
    S,
    P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11,
    any
  >;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>
  ): ActionReducer<
    S,
    P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12,
    any
  >;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>
  ): ActionReducer<
    S,
    P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13,
    any
  >;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>,
    c14: ActionReducer<S, P14, any>
  ): ActionReducer<
    S,
    P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14,
    any
  >;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>,
    c14: ActionReducer<S, P14, any>,
    c15: ActionReducer<S, P15, any>
  ): ActionReducer<
    S,
    | P1
    | P2
    | P3
    | P4
    | P5
    | P6
    | P7
    | P8
    | P9
    | P10
    | P11
    | P12
    | P13
    | P14
    | P15,
    any
  >;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>,
    c14: ActionReducer<S, P14, any>,
    c15: ActionReducer<S, P15, any>,
    c16: ActionReducer<S, P16, any>
  ): ActionReducer<
    S,
    | P1
    | P2
    | P3
    | P4
    | P5
    | P6
    | P7
    | P8
    | P9
    | P10
    | P11
    | P12
    | P13
    | P14
    | P15
    | P16,
    any
  >;

  <
    S,
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17
  >(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>,
    c14: ActionReducer<S, P14, any>,
    c15: ActionReducer<S, P15, any>,
    c16: ActionReducer<S, P16, any>,
    c17: ActionReducer<S, P17, any>
  ): ActionReducer<
    S,
    | P1
    | P2
    | P3
    | P4
    | P5
    | P6
    | P7
    | P8
    | P9
    | P10
    | P11
    | P12
    | P13
    | P14
    | P15
    | P16
    | P17,
    any
  >;

  <
    S,
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    P18
  >(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>,
    c14: ActionReducer<S, P14, any>,
    c15: ActionReducer<S, P15, any>,
    c16: ActionReducer<S, P16, any>,
    c17: ActionReducer<S, P17, any>,
    c18: ActionReducer<S, P18, any>
  ): ActionReducer<
    S,
    | P1
    | P2
    | P3
    | P4
    | P5
    | P6
    | P7
    | P8
    | P9
    | P10
    | P11
    | P12
    | P13
    | P14
    | P15
    | P16
    | P17
    | P18,
    any
  >;

  <
    S,
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    P18,
    P19
  >(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>,
    c14: ActionReducer<S, P14, any>,
    c15: ActionReducer<S, P15, any>,
    c16: ActionReducer<S, P16, any>,
    c17: ActionReducer<S, P17, any>,
    c18: ActionReducer<S, P18, any>,
    c19: ActionReducer<S, P19, any>
  ): ActionReducer<
    S,
    | P1
    | P2
    | P3
    | P4
    | P5
    | P6
    | P7
    | P8
    | P9
    | P10
    | P11
    | P12
    | P13
    | P14
    | P15
    | P16
    | P17
    | P18
    | P19,
    any
  >;

  <
    S,
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    P18,
    P19,
    P20
  >(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>,
    c9: ActionReducer<S, P9, any>,
    c10: ActionReducer<S, P10, any>,
    c11: ActionReducer<S, P11, any>,
    c12: ActionReducer<S, P12, any>,
    c13: ActionReducer<S, P13, any>,
    c14: ActionReducer<S, P14, any>,
    c15: ActionReducer<S, P15, any>,
    c16: ActionReducer<S, P16, any>,
    c17: ActionReducer<S, P17, any>,
    c18: ActionReducer<S, P18, any>,
    c19: ActionReducer<S, P19, any>,
    c20: ActionReducer<S, P20, any>
  ): ActionReducer<
    S,
    | P1
    | P2
    | P3
    | P4
    | P5
    | P6
    | P7
    | P8
    | P9
    | P10
    | P11
    | P12
    | P13
    | P14
    | P15
    | P16
    | P17
    | P18
    | P19
    | P20,
    any
  >;
}

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
