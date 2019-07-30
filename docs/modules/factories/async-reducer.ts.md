---
title: factories/async-reducer.ts
nav_order: 8
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [asyncEntityReducer (function)](#asyncentityreducer-function)
- [asyncReducerFactory (function)](#asyncreducerfactory-function)

---

# asyncEntityReducer (function)

Generate a reducer that handles a record of multiple AsyncData store values

**Signature**

```ts
export const asyncEntityReducer = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, Record<string, AsyncData<E, R>>>,
  toId: Lens<P, string>
) => ...
```

Added in v5.0.0

# asyncReducerFactory (function)

Generate a reducer that wraps a single AsyncData store value

**Signature**

```ts
export const asyncReducerFactory = <P, R, E, M, S>(
  action: AsyncActionCreators<P, R, E, M>,
  lens: Lens<S, AsyncData<E, R>>
) => ...
```

Added in v5.0.0
