---
title: Reducers.ts
nav_order: 4
parent: Modules
---

## Reducers overview

Utility functions for filtering and combining reducers

Added in v5.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Reducer (type alias)](#reducer-type-alias)
  - [asyncEntityFactory](#asyncentityfactory)
  - [asyncReducerFactory](#asyncreducerfactory)
  - [caseFn](#casefn)
  - [casesFn](#casesfn)
  - [composeRecord](#composerecord)
  - [filterReducer](#filterreducer)
  - [reducerDefaultFn](#reducerdefaultfn)
  - [reducerFn](#reducerfn)

---

# utils

## Reducer (type alias)

Reducer Interface

**Signature**

```ts
export type Reducer<S, A extends TypedAction = TypedAction> = (s: S, a: A) => S
```

Added in v5.0.0

## asyncEntityFactory

Generate a reducer that handles a record of multiple DatumEither store values

**Signature**

```ts
export declare const asyncEntityFactory: AsyncEntityFactory
```

Added in v5.0.0

## asyncReducerFactory

Generate a reducer that wraps a single DatumEither store value

**Signature**

```ts
export declare const asyncReducerFactory: AsyncReducerFactory
```

Added in v5.0.0

## caseFn

Case function matches ActionCreator to Reducer.

**Signature**

```ts
export declare const caseFn: <S, P, M>(
  action: ActionCreator<P, M>,
  reducer: Reducer<S, Action<P, M>>
) => Reducer<S, TypedAction>
```

Added in v5.0.0

## casesFn

Case function matches multiple ActionCreators to a Reducer.

**Signature**

```ts
export declare const casesFn: <S, A extends ActionCreator<any, any>[]>(
  actionCreators: A,
  reducer: Reducer<S, ExtractAction<A>>
) => Reducer<S, TypedAction>
```

Added in v5.0.0

## composeRecord

Similar to atKey with a default value

**Signature**

```ts
export declare const composeRecord: <S, T extends Record<string, any>, K extends keyof T>(
  lens: Lens<S, T>,
  def: T[K]
) => (id: K) => Lens<S, T[K]>
```

Added in v8.2.0

## filterReducer

Filters actions by first section of action type to bypass sections of the store

**Signature**

```ts
export declare const filterReducer: <S, P>(match: string, reducer: Reducer<S, TypedAction>) => Reducer<S, TypedAction>
```

Added in v7.1.0

## reducerDefaultFn

Compose caseFn and casesFn with initial state.

**Signature**

```ts
export declare const reducerDefaultFn: <S>(
  initialState: S,
  ...cases: Reducer<S, TypedAction>[]
) => Reducer<S, TypedAction>
```

Added in v5.0.0

## reducerFn

Compose caseFn and casesFn.

**Signature**

```ts
export declare const reducerFn: <S>(...cases: Reducer<S, TypedAction>[]) => Reducer<S, TypedAction>
```

Added in v5.0.0
