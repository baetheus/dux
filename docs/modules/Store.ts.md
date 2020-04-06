---
title: Store.ts
nav_order: 5
parent: Modules
---

# Store overview

Added in v8.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [MetaReducer (type alias)](#metareducer-type-alias)
- [RunEvery (type alias)](#runevery-type-alias)
- [RunOnce (type alias)](#runonce-type-alias)
- [Selector (type alias)](#selector-type-alias)
- [Store (type alias)](#store-type-alias)
- [createStore](#createstore)
- [filterEvery](#filterevery)

---

# MetaReducer (type alias)

A MetaReducer is a function that takes a reducer and returns a reducer. It's useful
for modifying or tracking the state before and after a reducer fires.

**Signature**

```ts
export type MetaReducer<S> = (reducer: Reducer<S>) => Reducer<S>
```

**Example**

```ts
import { MetaReducer } from '../../src/Store'

export const loggingMetaReducer: MetaReducer<any> = reducer => {
  return function loggingReducer(previousState, action) {
    const state = reducer(previousState, action)
    console.log(action.type, { previousState, state, action })
    return state
  }
}
```

Added in v8.0.0

# RunEvery (type alias)

A RunEvery function is called after every store reduction. It can return nothing,
an action, a promise that returns nothing or an action, or an observable of actions.

To return multiple actions one can use an observable.

**Signature**

```ts
export type RunEvery<S, A extends TypedAction = TypedAction> = (
  state: S,
  action: A
) => Observable<TypedAction> | Promise<TypedAction | void> | TypedAction | void
```

**Example**

```ts
import { RunEvery } from '../../src/Store'
import { from } from 'rxjs'

export const logger: RunEvery<{}> = (state, action) => {
  console.log(`State after ${action.type} reduced:`, { state, action })
}

export const chainMultipleActions: RunEvery<{}> = (state, action) => {
  if (action.type === 'MULTIPLE') {
    return from([{ type: 'MULTI_1' }, { type: 'MULTI_2' }, { type: 'MULTI_3' }])
  }
}
```

Added in v8.0.0

# RunOnce (type alias)

A RunOnce function is called immediately after being added to the store.
It can only return an observable of actions. This observable need not every
emit an action. (So EMPTY and NEVER) are ok to return.

**Signature**

```ts
export type RunOnce<S> = (actions$: Observable<TypedAction>, state$: Observable<S>) => Observable<TypedAction>
```

**Example**

```ts
import { RunOnce } from '../../src/Store'
import { tap, withLatestFrom, mergeMapTo } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

export const logger: RunOnce<{}> = (actions$, state$) =>
  actions$.pipe(
    withLatestFrom(state$),
    tap(([action, state]) => console.log(`State after ${action.type} reduced:`, { state, action })),
    mergeMapTo(EMPTY)
  )
```

Added in v8.0.0

# Selector (type alias)

A Selector narrows or modifies the state. It is effectively a lens into a particular
part of the state.

**Signature**

```ts
export type Selector<S, O> = (state: S) => O
```

**Example**

```ts
import { createStore } from '../../src/Store'

const store = createStore({ count: 0 }).addReducers((state, _) => ({ count: state.count + 1 }))
store.select(state => state.count).subscribe(count => console.log(`New count is: ${count}`))
store.dispatch({ type: 'ANY_ACTION' })
```

Added in v8.0.0

# Store (type alias)

The store API.

**Signature**

```ts
export type Store<S> = {
  getState: () => S
  setState: (s: S) => void
  addReducers: (...reducers: Reducer<S>[]) => Store<S>
  removeReducers: (...reducers: Reducer<S>[]) => Store<S>
  addMetaReducers: (...metaReducers: MetaReducer<S>[]) => Store<S>
  removeMetaReducers: (...metaReducers: MetaReducer<S>[]) => Store<S>
  addRunEverys: (...everys: RunEvery<S>[]) => Store<S>
  removeRunEverys: (...everys: RunEvery<S>[]) => Store<S>
  addRunOnces: (...onces: RunOnce<S>[]) => Store<S>
  removeRunOnces: (...onces: RunOnce<S>[]) => Store<S>
  select: <O>(selector: Selector<S, O>, predicate?: (a: O, b: O) => boolean) => Observable<O>
  dispatch: (...as: TypedAction[]) => void
  destroy: () => void
}
```

Added in v8.0.0

# createStore

While the redux pattern is powerful, it is also painful to instrument. This implementation
of the redux pattern combines redux-observable and a more flexible interface for adding
and removed reducers, metareducers(middleware), and epics.

The ordering of events in a running store is very specific:

1. A new action is received.
2. MetaReducers are run in the order they were added.
3. Reducers are run in the order they were added.
4. Selectors are called in the order they were added.
5. Epics are called in the order they were added.
6. Actions that are emitted by Epics are pushed back into the queue.

**Signature**

```ts
export const createStore = <S>(state: S): Store<S> => ...
```

**Example**

```ts
import { createStore } from '../../src/Store'

type State = {
  count: number
}
const initialState: State = { count: 0 }

export const myStore = createStore(initialState)
```

Added in v8.0.0

# filterEvery

filterEvery is like a caseFn for a RunEvery. It takes an ActionCreator
from the Actions module and a RunEvery specific to that action. It will
only run the supplied RunEvery after the supplied action matches the
ActionCreator.

**Signature**

```ts
export const filterEvery = <S, P, M>(
  ac: ActionCreator<P, M>,
  fn: RunEvery<S, Action<P, M>>
): RunEvery<S> => (state, action) => ...
```

**Example**

```ts
import { filterEvery } from '../../src/Store'
import { actionCreatorFactory } from '../../src/Actions'

const { simple } = actionCreatorFactory('EXAMPLES')
const simpleAction = simple<number>('SIMPLE')

export const runEverySimpleAction = filterEvery(simpleAction, (state: any, action) =>
  console.log('Saw a simpleAction', { state, action })
)
```

Added in v8.2.0
