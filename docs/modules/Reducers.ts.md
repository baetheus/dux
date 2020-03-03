---
title: Reducers.ts
nav_order: 6
parent: Modules
---

# Reducers overview

Added in v5.0.0

Reducer types and reducer factories

---

<h2 class="text-delta">Table of contents</h2>

- [Reducer (type alias)](#reducer-type-alias)
- [asyncEntityFactory](#asyncentityfactory)
- [asyncReducerFactory](#asyncreducerfactory)
- [caseFn](#casefn)
- [casesFn](#casesfn)
- [filterReducer](#filterreducer)
- [reducerDefaultFn](#reducerdefaultfn)
- [reducerFn](#reducerfn)

---

# Reducer (type alias)

Reducer Interface

**Signature**

```ts
export type Reducer<S, A extends TypedAction = TypedAction> = (s: S, a: A) => S
```

Added in v5.0.0

# asyncEntityFactory

Generate a reducer that handles a record of multiple DatumEither store values

**Signature**

```ts
export const asyncEntityFactory: AsyncEntityFactory = (action, lens, toId) => ...
```

Added in v5.0.0

# asyncReducerFactory

Generate a reducer that wraps a single DatumEither store value

**Signature**

```ts
export const asyncReducerFactory: AsyncReducerFactory = (action, lens) =>
  reducerFn(
    caseFn(action.pending, lens.modify(toRefresh)),
    caseFn(action.success, (s, a) => lens.set(success(a.value.result))(s)),
    caseFn(action.failure, (s, a) => ...
```

Added in v5.0.0

# caseFn

Case function matches ActionCreator to Reducer.

**Signature**

```ts
export const caseFn = <S, P, M>(
  action: ActionCreator<P, M>,
  reducer: Reducer<S, Action<P, M>>
): Reducer<S, TypedAction> => (s, a) => ...
```

Added in v5.0.0

# casesFn

Case function matches multiple ActionCreators to a Reducer.

**Signature**

```ts
export const casesFn = <S, A extends ActionCreator<any, any>[]>(
  actionCreators: A,
  reducer: Reducer<S, ExtractAction<A>>
): Reducer<S, TypedAction> => (s, a) =>
  actionCreators.some(({ match }) => ...
```

Added in v5.0.0

# filterReducer

Filters actions by first section of action type to bypass sections of the store

**Signature**

```ts
export const filterReducer = <S, P>(
  match: string,
  reducer: Reducer<S, TypedAction>
): Reducer<S, TypedAction> => (state, action) => ...
```

Added in v7.1.0

# reducerDefaultFn

Compose caseFn and casesFn with initial state.

**Signature**

```ts
export const reducerDefaultFn = <S>(
  initialState: S,
  ...cases: Array<Reducer<S, TypedAction>>
): Reducer<S | undefined, TypedAction> => (state = initialState, action) =>
  cases.reduce((s, r) => ...
```

Added in v5.0.0

# reducerFn

Compose caseFn and casesFn.

**Signature**

```ts
export const reducerFn = <S>(
  ...cases: Array<Reducer<S, TypedAction>>
): Reducer<S, TypedAction> => (state, action) =>
  cases.reduce((s, r) => ...
```

Added in v5.0.0
