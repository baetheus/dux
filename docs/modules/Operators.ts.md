---
title: Operators.ts
nav_order: 2
parent: Modules
---

## Operators overview

A collection of rxjs operators specific to working with observabled of actions.

Added in v8.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [FilterActions (interface)](#filteractions-interface)
  - [asyncConcatMap](#asyncconcatmap)
  - [asyncExhaustMap](#asyncexhaustmap)
  - [asyncMergeMap](#asyncmergemap)
  - [asyncSwitchMap](#asyncswitchmap)
  - [filterActions](#filteractions)
  - [mapAction](#mapaction)

---

# utils

## FilterActions (interface)

Interface for the filterActions operator.

**Signature**

```ts
export interface FilterActions {
  <P1, M1>(a1: ActionCreator<P1, M1>): (source: Observable<TypedAction>) => Observable<Action<P1, M1>>
  <P1, M1, P2, M2>(a1: ActionCreator<P1, M1>, a2: ActionCreator<P2, M2>): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1> | Action<P2, M2>>
  <P1, M1, P2, M2, P3, M3>(a1: ActionCreator<P1, M1>, a2: ActionCreator<P2, M2>, a3: ActionCreator<P3, M3>): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3>>
  <P1, M1, P2, M2, P3, M3, P4, M4>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>
  ): (source: Observable<TypedAction>) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4>>
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>
  ): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4> | Action<P5, M5>>
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5, P6, M6>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>
  ): (
    source: Observable<TypedAction>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4> | Action<P5, M5> | Action<P6, M6>>
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5, P6, M6, P7, M7>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>
  ): (
    source: Observable<TypedAction>
  ) => Observable<
    Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4> | Action<P5, M5> | Action<P6, M6> | Action<P7, M7>
  >
  <P1, M1, P2, M2, P3, M3, P4, M4, P5, M5, P6, M6, P7, M7, P8, M8>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>,
    a8: ActionCreator<P8, M8>
  ): (
    source: Observable<TypedAction>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
    | Action<P6, M6>
    | Action<P7, M7>
    | Action<P8, M8>
  >
  <A extends ActionCreator<any, any>[]>(...as: A): (source: Observable<TypedAction>) => Observable<ExtractAction<A>>
}
```

Added in v5.0.0

## asyncConcatMap

Wraps an asyncAction in a concatMap

**Signature**

```ts
export declare const asyncConcatMap: <P, R, E, M extends Record<string, any>>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P, meta: M) => Observable<R>
) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>>
```

Added in v5.0.0

## asyncExhaustMap

Wraps an asyncAction in an exhaustMap

**Signature**

```ts
export declare const asyncExhaustMap: <P, R, E, M extends Record<string, any>>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P, meta: M) => Observable<R>
) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>>
```

Added in v5.0.0

## asyncMergeMap

Wraps an asyncAction in a mergeMap

**Signature**

```ts
export declare const asyncMergeMap: <P, R, E, M extends Record<string, any>>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P, meta: M) => Observable<R>
) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>>
```

Added in v5.0.0

## asyncSwitchMap

Wraps an asyncAction in a switchMap

**Signature**

```ts
export declare const asyncSwitchMap: <P, R, E, M extends Record<string, any>>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P, meta: M) => Observable<R>
) => (obs: Observable<TypedAction>) => Observable<Action<Success<P, R>, M> | Action<Failure<P, E>, M>>
```

Added in v5.0.0

## filterActions

RxJS operator to filter acitons by multiple `ActionCreator`s.

**Signature**

```ts
export declare const filterActions: FilterActions
```

Added in v5.0.0

## mapAction

Filters on an action and a projection, and merges the output
of the projection with the original action.

ie. originalAction => [originalAction, ...project(originalAction)]

**Signature**

```ts
export declare const mapAction: <P, M extends Record<string, any>>(
  action: ActionCreator<P, M>,
  project: (action: Action<P, M>) => Action<any, any>[]
) => (obs: Observable<Action<any, any>>) => Observable<Action<any, any>>
```

Added in v5.0.0
