---
title: actions/factories.ts
nav_order: 1
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [actionCreator (function)](#actioncreator-function)
- [actionCreatorFactory (function)](#actioncreatorfactory-function)
- [asyncActionCreators (function)](#asyncactioncreators-function)

---

# actionCreator (function)

General action creator factory

**Signature**

```ts
export const actionCreator = <P, M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error = false
): ActionCreator<P, M> => ...
```

Added in v5.0.0

# actionCreatorFactory (function)

General action group creator (wraps other action creators into a group)

**Signature**

```ts
export const actionCreatorFactory = <M extends Meta = Meta>(
  group: string,
  groupMeta?: M
): ActionCreatorBundle<M> => ...
```

Added in v5.0.0

# asyncActionCreators (function)

Async action creator factory

**Signature**

```ts
export const asyncActionCreators = <P, R, E, M extends Meta = Meta>(
  group: string,
  commonMeta?: M
): AsyncActionCreators<P, R, E, M> => ...
```

Added in v5.0.0
