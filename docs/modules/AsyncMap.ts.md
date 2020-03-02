---
title: AsyncMap.ts
nav_order: 2
parent: Modules
---

# AsyncMap overview

Added in v5.0.0

Async map factories for async actions

---

<h2 class="text-delta">Table of contents</h2>

- [asyncConcatMap](#asyncconcatmap)
- [asyncExhaustMap](#asyncexhaustmap)
- [asyncMergeMap](#asyncmergemap)
- [asyncSwitchMap](#asyncswitchmap)

---

# asyncConcatMap

Wraps an asyncAction in a concatMap

**Signature**

```ts
export const asyncConcatMap: <P, R, E, M extends Readonly<{ [key: string]: any; }>>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0

# asyncExhaustMap

Wraps an asyncAction in an exhaustMap

**Signature**

```ts
export const asyncExhaustMap: <P, R, E, M extends Readonly<{ [key: string]: any; }>>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0

# asyncMergeMap

Wraps an asyncAction in a mergeMap

**Signature**

```ts
export const asyncMergeMap: <P, R, E, M extends Readonly<{ [key: string]: any; }>>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0

# asyncSwitchMap

Wraps an asyncAction in a switchMap

**Signature**

```ts
export const asyncSwitchMap: <P, R, E, M extends Readonly<{ [key: string]: any; }>>(action: AsyncActionCreators<P, R, E, M>, project: (params: P, meta: M) => Observable<R>) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>> = ...
```

Added in v5.0.0
