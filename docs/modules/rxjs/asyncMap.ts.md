---
title: rxjs/asyncMap.ts
nav_order: 10
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [asyncConcatMap (constant)](#asyncconcatmap-constant)
- [asyncExhaustMap (constant)](#asyncexhaustmap-constant)
- [asyncMergeMap (constant)](#asyncmergemap-constant)
- [asyncSwitchMap (constant)](#asyncswitchmap-constant)
- [mapAction (function)](#mapaction-function)

---

# asyncConcatMap (constant)

Wraps an asyncAction in a concatMap

**Signature**

```ts
export const asyncConcatMap: <P, R, E, M extends Meta>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0

# asyncExhaustMap (constant)

Wraps an asyncAction in an exhaustMap

**Signature**

```ts
export const asyncExhaustMap: <P, R, E, M extends Meta>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0

# asyncMergeMap (constant)

Wraps an asyncAction in a mergeMap

**Signature**

```ts
export const asyncMergeMap: <P, R, E, M extends Meta>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0

# asyncSwitchMap (constant)

Wraps an asyncAction in a switchMap

**Signature**

```ts
export const asyncSwitchMap: <P, R, E, M extends Meta>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0

# mapAction (function)

Filters on an action and a projection, and merges the output
of the projection with the original action.

ie. originalAction => [originalAction, ...project(originalAction)]

**Signature**

```ts
export const mapAction = <P, M extends Meta>(
  action: ActionCreator<P, M>,
  project: (action: Action<P, M>) => Action<any, any>[]
) => (obs: Observable<Action<any, any>>) =>
  obs.pipe(mergeMap(a => ...
```

Added in v5.0.0
