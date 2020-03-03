---
title: Epics.ts
nav_order: 3
parent: Modules
---

# Epics overview

The Epics module contains tools relating to side effects of a store. This includes things
like chaining on action from another, making an api request and returning an action on
response, etc.

Added in v8.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Epic (type alias)](#epic-type-alias)
- [fromAsyncAction](#fromasyncaction)

---

# Epic (type alias)

An Epic encapsulates side effects or temporal changes for the store.
It is given access to the current action and state, the action and
state observables, and may return nothing, an action, a promise that
contains an action, or an observable of actions.

**Signature**

```ts
export type Epic<S> = (
  state: S,
  action: TypedAction,
  state$: Observable<S>,
  actions$: Observable<TypedAction>
) => Observable<TypedAction | Nil> | Promise<TypedAction | Nil> | TypedAction | Nil
```

**Example**

```ts
import { Epic } from '../../src/Epics'

export const loggingEpic: Epic<any> = (action, state) => {
  console.log(`State after ${action.type} reduced:`, { state, action })
}
```

Added in v8.0.0

# fromAsyncAction

Construct an Epic from an AsyncActionCreator and a projection function.
The projection function recieves the parameters of the pending action
and must return an observable of the result type.

**Signature**

```ts
export const fromAsyncAction = <P, R, E, M, S>(
  ac: AsyncActionCreators<P, R, E, M>,
  project: (params: P) => Observable<R>
): Epic<S> => (_, action) => ...
```

Added in v8.0.0
