---
title: Actions.ts
nav_order: 1
parent: Modules
---

# Actions overview

Added in v5.0.0

Actions types and action factories

---

<h2 class="text-delta">Table of contents</h2>

- [Action (interface)](#action-interface)
- [AsyncActionCreators (interface)](#asyncactioncreators-interface)
- [Failure (interface)](#failure-interface)
- [Success (interface)](#success-interface)
- [TypedAction (interface)](#typedaction-interface)
- [ActionCreator (type alias)](#actioncreator-type-alias)
- [ExtractAction (type alias)](#extractaction-type-alias)
- [Meta (type alias)](#meta-type-alias)
- [actionCreatorFactory](#actioncreatorfactory)
- [actionFactory](#actionfactory)
- [collapseType](#collapsetype)

---

# Action (interface)

Interface for FSA Action.

**Signature**

```ts
export interface Action<P, M extends Meta = Meta> extends TypedAction {
  readonly value: P
  readonly meta: M
  readonly error: boolean
}
```

Added in v5.0.0

# AsyncActionCreators (interface)

Interface for async action creator

**Signature**

```ts
export interface AsyncActionCreators<P, R = unknown, E = unknown, M extends Meta = Meta> {
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

The bare minimum interface for actions in the dux system.
If your existing store doesn't have actions with a type parameter
that you can switch on then dux won't work (at least with typescript).

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
export type ActionCreator<P, M extends Meta = Meta> = ActionFunction<P, M> & ActionMatcher<P, M> & ActionTag
```

Added in v5.0.0

# ExtractAction (type alias)

Extract an Action type from an ActionCreator

**Signature**

```ts
export type ExtractAction<T> = T extends ActionCreator<infer P, infer M>[] ? Action<P, M> : Action<unknown, Meta>
```

Added in v8.0.0

# Meta (type alias)

Interface for metadata.

**Signature**

```ts
export type Meta = Record<string, any>
```

Added in v5.0.0

# actionCreatorFactory

General action group creator (wraps other action creators into a group)

**Signature**

```ts
export const actionCreatorFactory = <G extends string, M extends Meta = Meta>(
  group: G,
  groupMeta?: M
): ActionCreatorBundle<G, M> => ...
```

Added in v5.0.0

# actionFactory

The simplest way to create an action.
Generally, for all but the simplest of applications, using
actionCreatorsFactory is a better move.

**Signature**

```ts
export const actionFactory = <P, M extends Meta = Meta>(
  type: string,
  commonMeta?: M,
  error = false
): ActionFunction<P, M> =>
  ((value: P, meta: M) => ...
```

Added in v7.0.0

# collapseType

**Signature**

```ts
export const collapseType = (...types: string[]) => ...
```

Added in v5.0.0
