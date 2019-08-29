---
title: Reducers.ts
nav_order: 6
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [CasesFn (interface)](#casesfn-interface)
- [ReducerFn (interface)](#reducerfn-interface)
- [ActionReducer (type alias)](#actionreducer-type-alias)
- [Handler (type alias)](#handler-type-alias)
- [Reducer (type alias)](#reducer-type-alias)
- [ReducerFailure (type alias)](#reducerfailure-type-alias)
- [ReducerSuccess (type alias)](#reducersuccess-type-alias)
- [asyncEntityReducer (function)](#asyncentityreducer-function)
- [asyncReducerFactory (function)](#asyncreducerfactory-function)
- [asyncReducersFactory (function)](#asyncreducersfactory-function)
- [caseFn (function)](#casefn-function)
- [casesFn (function)](#casesfn-function)
- [filterReducer (function)](#filterreducer-function)
- [reducerDefaultFn (function)](#reducerdefaultfn-function)
- [reducerFn (function)](#reducerfn-function)
- [splitType (function)](#splittype-function)

---

# CasesFn (interface)

Variadic interface for casesFn.

**Signature**

```ts
export interface CasesFn {
  <S, P1>(actionCreator: [ActionCreator<P1, any>], handler: Handler<S, P1>): ActionReducer<S, P1, any>
  <S, P1, P2>(
    actionCreator: [ActionCreator<P1, any>, ActionCreator<P2, any>],
    handler: Handler<S, P1 | P2>
  ): ActionReducer<S, P1 | P2, any>
  <S, P1, P2, P3>(
    actionCreator: [ActionCreator<P1, any>, ActionCreator<P2, any>, ActionCreator<P3, any>],
    handler: Handler<S, P1 | P2 | P3>
  ): ActionReducer<S, P1 | P2 | P3, any>
  <S, P1, P2, P3, P4>(
    actionCreator: [ActionCreator<P1, any>, ActionCreator<P2, any>, ActionCreator<P3, any>, ActionCreator<P4, any>],
    handler: Handler<S, P1 | P2 | P3 | P4>
  ): ActionReducer<S, P1 | P2 | P3 | P4, any>
  <S, P1, P2, P3, P4, P5>(
    actionCreator: [
      ActionCreator<P1, any>,
      ActionCreator<P2, any>,
      ActionCreator<P3, any>,
      ActionCreator<P4, any>,
      ActionCreator<P5, any>
    ],
    handler: Handler<S, P1 | P2 | P3 | P4 | P5>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5, any>
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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6, any>
  <S>(actionCreator: [ActionCreator<any, any>], handler: Handler<S, any>): ActionReducer<S, any, any>
}
```

Added in v5.0.0

# ReducerFn (interface)

Variadic interface for reduceFn.

**Signature**

```ts
export interface ReducerFn {
  <S>(): ActionReducer<S, void, any>
  <S, P1>(c1: ActionReducer<S, P1, any>): ActionReducer<S, P1, any>
  <S, P1, P2>(c1: ActionReducer<S, P1, any>, c2: ActionReducer<S, P2, any>): ActionReducer<S, P1 | P2, any>
  <S, P1, P2, P3>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>
  ): ActionReducer<S, P1 | P2 | P3, any>
  <S, P1, P2, P3, P4>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4, any>
  <S, P1, P2, P3, P4, P5>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5, any>
  <S, P1, P2, P3, P4, P5, P6>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6, any>
  <S, P1, P2, P3, P4, P5, P6, P7>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7, any>
  <S, P1, P2, P3, P4, P5, P6, P7, P8>(
    c1: ActionReducer<S, P1, any>,
    c2: ActionReducer<S, P2, any>,
    c3: ActionReducer<S, P3, any>,
    c4: ActionReducer<S, P4, any>,
    c5: ActionReducer<S, P5, any>,
    c6: ActionReducer<S, P6, any>,
    c7: ActionReducer<S, P7, any>,
    c8: ActionReducer<S, P8, any>
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8, any>
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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15 | P16, any>

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
  ): ActionReducer<S, P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | P11 | P12 | P13 | P14 | P15 | P16 | P17, any>

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
  >

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
  >

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
  >
}
```

Added in v5.0.0

# ActionReducer (type alias)

Action Reducer Interface

**Signature**

```ts
export type ActionReducer<S, P, M extends Meta> = (state: S, action: Action<P, M>) => S
```

Added in v5.0.0

# Handler (type alias)

Interface for action handler.

**Signature**

```ts
export type Handler<S, P> = (state: S, payload: P) => S
```

Added in v5.0.0

# Reducer (type alias)

Reducer Interface

**Signature**

```ts
export type Reducer<S, I = void> = (s: S, r: I) => S
```

Added in v5.0.0

# ReducerFailure (type alias)

Failure Reducer Interface

**Signature**

```ts
export type ReducerFailure<S, I, O = Error> = (s: S, r: Failure<I, O>) => S
```

Added in v5.0.0

# ReducerSuccess (type alias)

Success Reducer Interface

**Signature**

```ts
export type ReducerSuccess<S, I, O> = (s: S, r: Success<I, O>) => S
```

Added in v5.0.0

# asyncEntityReducer (function)

Generate a reducer that handles a record of multiple DatumEither store values

**Signature**

```ts
export const asyncEntityReducer = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, Record<string, DatumEither<E, R>>>,
  toId: Lens<P, string>
) => ...
```

Added in v5.0.0

# asyncReducerFactory (function)

Generate a reducer that wraps a single DatumEither store value

**Signature**

```ts
export const asyncReducerFactory = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, DatumEither<E, R>>
) => ...
```

Added in v5.0.0

# asyncReducersFactory (function)

Generates factories an asyncReducerFactory and asyncEntityReducer from an action.

**Signature**

```ts
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
  ) => ...
```

Added in v5.1.0

# caseFn (function)

Case function matches ActionCreator to handler.

**Signature**

```ts
export const caseFn = <S, P, M extends Meta>(
  action: ActionCreator<P, M>,
  handler: Handler<S, P>
): ActionReducer<S, P, M> => (s: S, a: Action<P, M>) => ...
```

Added in v5.0.0

# casesFn (function)

Case function matches multiple ActionCreators to a handler.

**Signature**

```ts
export const casesFn: CasesFn = <S>(
  actions: Array<ActionCreator<any, any>>,
  handler: Handler<S, any>
): ActionReducer<S, any, any> => (s: S, a: Action<any, any>) =>
  actions.some(({ match }) => ...
```

Added in v5.0.0

# filterReducer (function)

Filters actions by first section of action type to bypass sections of the store

**Signature**

```ts
export const filterReducer = <S, P, M>(
  groupName: string,
  reducer: ActionReducer<S, P, M>
): ActionReducer<S, P, M> => (state: S, action: Action<P, M>): S => ...
```

Added in v7.1.0

# reducerDefaultFn (function)

Compose caseFn and casesFn with initial state.

**Signature**

```ts
export const reducerDefaultFn = <S>(
  initialState: S,
  ...cases: Array<ActionReducer<S, any, any>>
) => (state: S | undefined = initialState, action: Action<any, any>): S =>
  cases.reduce((s, r) => ...
```

Added in v5.0.0

# reducerFn (function)

Compose caseFn and casesFn.

**Signature**

```ts
export const reducerFn: ReducerFn = <S>(
  ...cases: Array<ActionReducer<S, any, any>>
): ActionReducer<S, any, any> => (state: S, action: Action<any, any>) =>
  cases.reduce((s, r) => ...
```

Added in v5.0.0

# splitType (function)

Splits a TypedAction into a non-empty array of its component types

_Note_: String.split() always returns a non-empty array

**Signature**

```ts
export const splitType = (action: TypedAction): string[] & [string] => ...
```

Added in v7.1.0
