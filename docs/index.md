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
