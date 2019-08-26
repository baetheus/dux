---
title: Actions.ts
nav_order: 1
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [Action (interface)](#action-interface)
- [AsyncActionCreators (interface)](#asyncactioncreators-interface)
- [Failure (interface)](#failure-interface)
- [Success (interface)](#success-interface)
- [TypedAction (interface)](#typedaction-interface)
- [ActionCreator (type alias)](#actioncreator-type-alias)
- [ActionCreatorBundle (type alias)](#actioncreatorbundle-type-alias)
- [ActionCreatorFactory (type alias)](#actioncreatorfactory-type-alias)
- [ActionFunction (type alias)](#actionfunction-type-alias)
- [ActionMatcher (type alias)](#actionmatcher-type-alias)
- [Meta (type alias)](#meta-type-alias)
- [ResultAction (type alias)](#resultaction-type-alias)
- [actionCreator (function)](#actioncreator-function)
- [actionCreatorFactory (function)](#actioncreatorfactory-function)
- [actionFactory (function)](#actionfactory-function)
- [asyncActionCreators (function)](#asyncactioncreators-function)
- [collapseType (function)](#collapsetype-function)

---

# Action (interface)

Interface for FSA Action.

**Signature**

```ts
export interface Action<P, M extends Meta = Meta> {
  readonly type: string
  readonly payload: P
  readonly meta: M
  readonly error: boolean
}
```

Added in v5.0.0

# AsyncActionCreators (interface)

Interface for async action creator

**Signature**

```ts
export interface AsyncActionCreators<P = void, R = void, E = void, M extends Meta = Meta> {
  readonly pending: ActionCreator<P, M>
  readonly success: ActionCreator<Success<P, R>, M>
  readonly failure: ActionCreator<Failure<P, E>, M>
}
```

Added in v5.0.0

# Failure (interface)

Interface for "Failure" Action payload.

**Signature**

```ts
export interface Failure<P, E> {
  readonly params: P
  readonly error: E
}
```

Added in v5.0.0

# Success (interface)

Interface for "Success" Action payload.

**Signature**

```ts
export interface Success<P, R> {
  readonly params: P
  readonly result: R
}
```

Added in v5.0.0

# TypedAction (interface)

Interface for an action type

**Signature**

```ts
export interface TypedAction {
  readonly type: string
}
```

Added in v5.0.0

# ActionCreator (type alias)

Interface for action creator intersection

**Signature**

```ts
export type ActionCreator<P = void, M extends Meta = Meta> = TypedAction & ActionMatcher<P, M> & ActionFunction<P, M>
```

Added in v5.0.0

# ActionCreatorBundle (type alias)

Interface for the action creator bundle.

**Signature**

```ts
export type ActionCreatorBundle<M extends Meta = Meta> = {
  simple: <P = void, M2 extends Meta = Meta>(
    type: string,
    meta?: M2,
    error?: boolean
  ) => ActionCreator<P, M2 & Partial<M>>
  async: <P = void, R = void, E = void, M2 extends Meta = Meta>(
    type: string,
    meta?: M2
  ) => AsyncActionCreators<P, R, E, M2 & Partial<M>>
}
```

Added in v5.0.0

# ActionCreatorFactory (type alias)

Interface for an action creator factory

**Signature**

```ts
export type ActionCreatorFactory = <M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error?: boolean
) => ActionCreatorBundle<M>
```

Added in v5.0.0

# ActionFunction (type alias)

Interface for action creator function

**Signature**

```ts
export type ActionFunction<P = void, M extends Meta = Meta> = P extends void
  ? (payload?: P, meta?: M) => Action<P, M>
  : (payload: P, meta?: M) => Action<P, M>
```

Added in v5.0.0

# ActionMatcher (type alias)

Interface for action matcher property

**Signature**

```ts
export type ActionMatcher<P, M> = {
  readonly match: (action: TypedAction) => action is Action<P, M>
}
```

Added in v5.0.0

# Meta (type alias)

Interface for metadata.

**Signature**

```ts
export type Meta = Readonly<object> & { readonly [key: string]: any }
```

Added in v5.0.0

# ResultAction (type alias)

Interface for result actions

**Signature**

```ts
export type ResultAction<P, R, E, M extends Meta> = Action<Success<P, R>, M> | Action<Failure<P, E>, M>
```

Added in v5.0.0

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

# actionFactory (function)

**Signature**

```ts
export const actionFactory = <P, M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error = false
): ActionFunction<P, M> =>
  ((payload: P, meta: M) => ...
```

Added in v7.0.0

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

# collapseType (function)

**Signature**

```ts
export const collapseType = (...types: string[]) => ...
```

Added in v7.0.0
