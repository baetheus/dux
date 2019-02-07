import { Action, ActionCreator, Failure, Meta, Success } from '../actions/interfaces';

export type Reducer<S, I = void> = (s: S, r: I) => S;
export type ReducerSuccess<S, I, O> = (s: S, r: Success<I, O>) => S;
export type ReducerFailure<S, I, O = Error> = (s: S, r: Failure<I, O>) => S;
export type ActionReducer<S, P, M extends Meta> = (state: S, action: Action<P, M>) => S;

/**
 * Interface for action handler.
 */
export type Handler<S, P> = (state: S, payload: P) => S;

/**
 * Variadic interface for casesFn.
 */
export interface CasesFn {
  <S, P1>(actionCreator: [ActionCreator<P1, any>], handler: Handler<S, P1>): ActionReducer<S, P1, any>;
  <S, P1, P2>(
    actionCreator: [ActionCreator<P1, any>, ActionCreator<P2, any>],
    handler: Handler<S, P1 | P2>
  ): ActionReducer<S, P1 | P2, any>;
  <S, P1, P2, P3>(
    actionCreator: [ActionCreator<P1, any>, ActionCreator<P2, any>, ActionCreator<P3, any>],
    handler: Handler<S, P1 | P2 | P3>
  ): ActionReducer<S, P1 | P2 | P3, any>;
  <S, P1, P2, P3, P4>(
    actionCreator: [ActionCreator<P1, any>, ActionCreator<P2, any>, ActionCreator<P3, any>, ActionCreator<P4, any>],
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
  <S>(actionCreator: [ActionCreator<any, any>], handler: Handler<S, any>): ActionReducer<S, any, any>;
}

/**
 * Variadic interface for reduceFn.
 */
export interface ReducerFn {
  <S>(): ActionReducer<S, void, any>;
  <S, P1>(c1: ActionReducer<S, P1, any>): ActionReducer<S, P1, any>;
  <S, P1, P2>(c1: ActionReducer<S, P1, any>, c2: ActionReducer<S, P2, any>): ActionReducer<S, P1 | P2, any>;
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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11, any>;

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12, any>;

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13, any>;

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14, any>;

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15, any>;

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15 | P16, any>;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17>(
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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15 | P16 | P17, any>;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18>(
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
    P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15 | P16 | P17 | P18,
    any
  >;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19>(
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
    P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15 | P16 | P17 | P18 | P19,
    any
  >;

  <S, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20>(
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
    P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15 | P16 | P17 | P18 | P19 | P20,
    any
  >;
}
