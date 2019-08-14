---
title: reducers/factories.ts
nav_order: 9
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [asyncEntityReducer (function)](#asyncentityreducer-function)
- [asyncReducerFactory (function)](#asyncreducerfactory-function)
- [asyncReducersFactory (function)](#asyncreducersfactory-function)

---

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
