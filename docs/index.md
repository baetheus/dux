---
title: Introduction
permalink: /
nav_order: 1
has_children: false
has_toc: false
---

# Simplified state management for Angular, React, Preact, and more.

`@nll/dux` is a TypeScript native library that provides a simple and flexible state management library and associated tools.
{: .fs-6 .fw-300 }

## Documentation

@nll/dux provides all of the familiar [flux](https://facebook.github.io/flux/), [redux](https://redux.js.org/), [redux-observable](https://redux-observable.js.org/), and [ngrx](https://ngrx.io/) interfaces you might be familiar with. The primary difference is that the store interface has been built for simplicity and ease of use.

You'll find fully typed documentation for:

- The [Store](./modules/Store.ts.html)
- [Actions](./modules/Actions.ts.html)
- [Reducers](./modules/Reducers.ts.html)
- [AsyncMap](./modules/AsyncMap.ts.html)
- [FilterActions](./modules/FilterActions.ts.html)
- [MapAction](./modules/MapAction.ts.html)

## Core Concepts

The goal of `@nll/dux` is to provide type-safe and efficient state management tools that work across front-end frameworks and back-end platforms.

### Start Simple with Get and Set

Compared to redux and ngrx, setting up a @nll/dux Store is much simpler. At heart we start with a simple getter/setter pattern.

```typescript
import { createStore } from "@nll/dux/Store";

type State = { count: number };
const initialState: State = { count: 0 };

const store = createStore(initialState);

console.log(store.getState()); // { count: 0 }
store.setState({ count: 1 });
console.log(store.getState()); // { count: 1 }
```

### Make it Reactive

Since reactivity is all the rage, let's listen to our store.

```typescript
import { createStore } from "@nll/dux/Store";

type State = { count: number };
const initialState: State = { count: 0 };

const store = createStore(initialState);

store.select(state => state.count).subscribe(x => console.log(`The count is ${x}!`));

store.setState({ count: 1 });

// Logs:
// "The count is 0!"
// "The count is 1!"
```

### Ok, but how is this better than just using an rxjs Subject?

It's not! So let's make it more useful with actions and reducers.

```typescript
import { createStore } from "@nll/dux/Store";
import { reducerFn, caseFn } from "@nll/dux/Reducers";
import { actionFactory } from "@nll/dux/Actions";

type State = { count: number };
const initialState: State = { count: 0 };

// Create Some Actions
const increment = actionFactory<number>("INCREMENT");
const reset = actionFactory("RESET");

// Create a "combined" reducer to handle those actions
const reducer = reducerFn<State>(
  caseFn(increment, (state, { value }) => ({ count: state.count + value })),
  caseFn(reset, () => initialState)
);

// Setup the Store
const store = createStore(initialState).addReducers(reducer);

store.select(state => state.count).subscribe(x => console.log(`The count is ${x}!`));

store.dispatch(increment(1), increment(2), increment(-10), reset());

// Logs:
// "The count is 0!"
// "The count is 1!"
// "The count is 3!"
// "The count is -7!"
// "The count is 0!"
```

### Maybe you've read [EIP](https://www.enterpriseintegrationpatterns.com/)?

@nll/Store takes the flux approach over the redux one in that there shouldn't be just one state object.

```typescript
import { createStore, RunEvery } from "@nll/dux/Store";
import { reducerFn, caseFn } from "@nll/dux/Reducers";
import { actionFactory } from "@nll/dux/Actions";

// CountStore
type CountState = { count: number };
const initialCountState: CountState = { count: 0 };

const increment = actionFactory<number>("INCREMENT");
const reset = actionFactory("RESET");

const reducer = reducerFn<CountState>(
  caseFn(increment, (state, { value }) => ({ count: state.count + value })),
  caseFn(reset, () => initialCountState)
);

const countStore = createStore(initialCountState).addReducers(reducer);

// FullnessStore
enum Fullness = {
  UnderEmpty = "UnderEmpty",
  Empty = "Empty",
  Low = "Low",
  HalfFull = "HalfFull",
  High = "High",
  Full = "Full",
  OverFull = "OverFull",
}
type FullnessState = Fullness
const initialFullnessState = Fullness.Empty;

const fullnessStore = createStore(initialFullnessState);

// Link stores
const fullnessLink: RunEvery<CountState> = ({ count }) => {
  if (count < 0) {
    fullnessStore.setState(Fullness.UnderEmpty);
  } else if (count === 0) {
    fullnessStore.setState(Fullness.Empty);
  } else if (count > 1 && count < 5) {
    fullnessStore.setState(Fullness.Low);
  } else if (count === 5) {
    fullnessStore.setState(Fullness.HalfFull);
  } else if (count > 5 && count < 10) {
    fullnessStore.setState(Fullness.High);
  } else if (count === 10) {
    fullnessStore.setState(Fullness.Full);
  } else {
    fullnessStore.setState(Fullness.OverFull);
  }
}
countStore.addRunEvery(fullnessLink);

// Log state changes
countStore.select(state => state.count).subscribe(x => console.log(`The count is ${x}!`));
fullnessStore.select(s => s).subscribe(x => console.log(`Fullness is ${x}!`));

// Launch some actions
countStore.dispatch(increment(1), increment(2), increment(-10), increment(17), reset());

// Logs:
// "The count is 0!"
// "Fullness is Empty!"
// "The count is 1!"
// "Fullness is Low!"
// "The count is 3!"
// "Fullness is Low!"
// "The count is -7!"
// "Fullness is UnderEmpty!"
// "The count is 10!"
// "Fullness is Full!"
// "The count is 0!"
// "Fullness is Empty!"
```

This example introduces a `RunEvery`. A run every is a lot like the combination of Epic from redux-observable, and a thunk from redux-thunk.

In essence a RunEvery does what it's name says, it runs on every action. Specifically, after the reducers and metareducers modify the store, a RunEvery is called with the new version of the store and the action that was dispatched. A RunEvery can return `void`, a `TypedAction`, an `Observable<TypedAction>`, or a `Promise<TypedAction | void>`. It is the simplest way to introduce action chaining or asynchrony to your store.

Some uses of RunEvery are:

- Simply logging the state and action.
- Chaining a state of `{ count: 10 }` to some other action.
- Launching a Promise that returns an action (ie. making a web request).
- Spliting one action into many by returning an observable.

_Note_: All return values of RunEvery are wrapped in `Promise.resolve`. This means that even RunEvery's that return an action or nothing (ie. synchronous RunEverys) will be scheduled on the next microtask. Thus, it is important to think of RunEvery as a truly asynchronous action.
