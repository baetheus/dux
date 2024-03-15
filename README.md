<h1>
  This library is no longer maintained. The core action and reducer functions have been migrated to the fun library and can be accessed on jsr.io [here](https://jsr.io/@baetheus/fun/doc/contrib/dux/~). Going forward dux is dropping specific support for Store, Observable, and React. The ideal replacement requires a refactor to use preact signals, which have a much simpler api and work great with the basic action/reducer combo that is still maintained. Sorry!
</h1>

<p align="center">
  A type safe functional toolkit for reducing boilerplate for Redux, Flux, Ngrx, and similar state management libraries.
</p>

<p align="center">
  <a href="https://travis-ci.org/nullpub/dux">
    <img src="https://img.shields.io/travis/nullpub/dux/master.svg" alt="build status" height="20">
  </a>
  <a href='https://coveralls.io/github/nullpub/dux?branch=master'>
    <img src='https://coveralls.io/repos/github/nullpub/dux/badge.svg?branch=master' alt='Coverage Status' height="20"/>
  </a>
  <a href="https://www.npmjs.com/package/@nll/dux">
    <img src="https://img.shields.io/npm/dm/@nll/dux.svg" alt="npm downloads" height="20">
  </a>
</p>

<p align="center">
  <a href="https://david-dm.org/nullpub/dux">
    <img src="https://img.shields.io/david/nullpub/dux.svg" alt="dependency status" height="20">
  </a>
  <a href="https://david-dm.org/nullpub/dux?type=dev">
    <img src="https://img.shields.io/david/dev/nullpub/dux.svg" alt="dev dependency status" height="20">
  </a>
  <a href="https://david-dm.org/nullpub/dux?type=peer">
    <img src="https://img.shields.io/david/peer/nullpub/dux.svg" alt="peer dependency status" height="20">
  </a>
</p>

# @nll/dux

State management, batteries included. In version 8.0.0 @nll/dux is releasing its own [Store](https://nullpub.github.io/dux/modules/Store.ts.html) that uses [rxjs](https://github.com/ReactiveX/rxjs) under the hood. The goal is to create a simple cross-framework state management system that is flexible enough to replace redux, ngrx, akita, or flux.

## Installation

```bash
npm i @nll/dux
```

## [Documentation](https://nullpub.github.io/dux)

@nll/dux is modular by default. The core modules are:

- [Store](https://nullpub.github.io/dux/modules/Store.ts.html)
- [Actions](https://nullpub.github.io/dux/modules/Actions.ts.html)
- [Reducers](https://nullpub.github.io/dux/modules/Reducers.ts.html)

Additionally, there are modules for use with advanced side effect management and specific frameworks:

- [Operators](https://nullpub.github.io/dux/modules/Operators.ts.html)
- [Angular](https://nullpub.github.io/dux/modules/Angular.ts.html)
- [React](https://nullpub.github.io/dux/modules/React.ts.html)

## Core Concepts

If you've used redux, ngrx, or flux, @nll/dux/Store will be very familiar. If not, here is a primer on some simple usage.

### Store

A store manages some stateful data. For the most basic case it's not necessary to use reducers or actions.

#### Basic Get/Set Store

```typescript
import { createStore } from "@nll/dux/Store";

type State = { count: number };
const initialState: State = { count: 0 };

const store = createStore(initialState);

console.log(store.getState()); // { count: 0 }
store.setState({ count: 1 });
console.log(store.getState()); // { count: 1 }
```

#### Make it Reactive

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

Notice that subscribing to the store will always output the initial state!

#### Ok, but how is this better than just using an rxjs Subject?

It's not! So let's make it more useful with actions and reducers.

```typescript
import { createStore } from "@nll/dux/Store";
import { reducerFn, caseFn } from "@nll/dux/Reducers";
import { actionFactory } from "@nll/dux/Actions";

// Let's define a type to represent state, as well as an initial state.
type State = { count: number };
const initialState: State = { count: 0 };

// Create Some Actions using the simplest actionFactory
const increment = actionFactory<number>("INCREMENT");
const reset = actionFactory("RESET");

// Create a "combined" reducer to handle those actions
const reducer = reducerFn<State>(
  caseFn(increment, (state, { value }) => ({ count: state.count + value })),
  caseFn(reset, () => initialState)
);

// Setup the Store
const store = createStore(initialState).addReducers(reducer);

// Subscribe to the count
store.select(state => state.count).subscribe(x => console.log(`The count is ${x}!`));

// Dispatch some actions
store.dispatch(increment(1), increment(2), increment(-10), reset());

// Logs:
// "The count is 0!"
// "The count is 1!"
// "The count is 3!"
// "The count is -7!"
// "The count is 0!"
```

### Action Creators

This library implements a similar pattern to [typescript-fsa](https://github.com/aikoven/typescript-fsa). The primary differences between this library and typescript-fsa are:

- The [action types](https://github.com/nullpub/dux/blob/master/src/Actions.ts) are easier to understand
- The meta parameter is fully typed
- The action factories themselves are built up in combinator style so new action patterns can be added without much fuss

Following is a sample of a simple increment action, here the type annotation tells TypeScript what the payload type is:

```typescript
import { actionCreator } from "@nll/dux/Actions";
import * as assert from "assert";

const increment = actionCreator<number>("INCREMENT");

assert.deepStrictEqual(increment(1), {
  type: "INCREMENT",
  error: false,
  meta: {},
  payload: 1
});
```

Here is an example of an action using meta, metadata is primarily useful for troubleshooting.

```typescript
import { actionCreator } from "@nll/dux/Actions";
import * as assert from "assert";

const increment = actionCreator<number>("INCREMENT");

assert.deepStrictEqual(increment(1, { from: "HOME_PAGE" }), {
  type: "INCREMENT",
  error: false,
  meta: {
    from: "HOME_PAGE"
  },
  payload: 1
});
```

All action creators also have a match function that acts as a [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types).

```typescript
import { actionCreator } from "@nll/dux/Actions";
import * as assert from "assert";

const increment = actionCreator<number>("INCREMENT");

const incrementAction = increment(1);

assert.equal(increment.match(incrementAction), true);
```

@nll/dux also includes asynchronous action creators, which fit nicely with the [flow pattern](https://medium.com/@gcanti/slaying-a-ui-antipattern-with-flow-5eed0cfb627b). Here the type annotations tell TypeScript what the `pending`, `failure`, and `success` types are.

```typescript
import { asyncActionCreators } from "@nll/dux/Actions";
import * as assert from "assert";

const increment = asyncActionCreators<number, number, string>("INCREMENT");

assert.deepStrictEqual(increment.pending(1), {
  type: "INCREMENT/PENDING",
  error: false,
  meta: {},
  payload: 1
});

assert.deepStrictEqual(increment.failure({ params: 1, error: "Wrong Number!" }), {
  type: "INCREMENT/FAILURE",
  error: true,
  meta: {},
  payload: {
    params: 1,
    error: "Wrong Number!"
  }
});

assert.deepStrictEqual(increment.success({ params: 1, result: 2 }), {
  type: "INCREMENT/SUCCESS",
  error: false,
  meta: {},
  payload: {
    params: 1,
    result: 2
  }
});
```

Lastly, @nll/dux includes a grouping factory, which is nice for when you want to create groups of actions.

```typescript
import { actionCreatorFactory } from "@nll/dux/Actions";
import * as assert from "assert";

const actionGroup = actionCreatorFactory("MY_GROUP_NAME");

const increment = actionGroup.simple<number>("INCREMENT");
const asyncIncrement = actionGroup.async<number, number, string>("ASYNC_INCREMENT");

assert.deepStrictEqual(increment(1), {
  type: "MY_GROUP_NAME/INCREMENT",
  error: false,
  meta: {},
  payload: 1
});

assert.deepStrictEqual(asyncIncrement.pending(1), {
  type: "MY_GROUP_NAME/INCREMENT/PENDING",
  error: false,
  meta: {},
  payload: 1
});
```

### Reducers

What are actions without reducers? @nll/dux includes a very similar set of reducer functions similar to [typescript-fsa-reducers](https://github.com/dphilipson/typescript-fsa-reducers). The initial design for these reducers came from Patrick Martin in [rx-fsa](https://github.com/patrimart/rx-fsa).

The core idea behind @nll/dux reducers is that reducers are composable, so there is no point in building large switch case blocks. We already have the type guards in the action match function, so why not utilize those to isolate individual reducers.

A `caseFn` is itself a very simple reducer:

```typescript
import { actionCreator } from "@nll/dux/Actions";
import { caseFn } from "@nll/dux/Reducers";
import * as assert from "assert";

type State = {
  counter: number;
};

const increment = actionCreator<number>("INCREMENT");

const incrementCaseFn = caseFn(increment, (state: State, payload) => ({
  ...state,
  counter: state.counter + payload
}));

assert.deepStrictEqual(incrementCaseFn({ counter: 0 }, increment(1)), {
  counter: 1
});
```

We can build up a collection of case functions and compose them using the reducerFn combinator:

```typescript
import { actionCreator } from "@nll/dux/Actions";
import { caseFn, reducerFn } from "@nll/dux/Reducers";
import * as assert from "assert";

type State = {
  counter: number;
};

const increment = actionCreator<number>("INCREMENT");
const resetCounter = actionCreator("RESET");

const addOne = increment(1);
const subtractOne = increment(-1);

const reset = resetCounter(undefined);

const counterReducer = reducerFn(
  caseFn(increment, (state: State, payload) => ({
    ...state,
    counter: state.counter + payload
  })),
  caseFn(resetCounter, state => ({ ...state, counter: 0 }))
);

assert.deepStrictEqual(counterReducer({ counter: 0 }, addOne), { counter: 1 });
assert.deepStrictEqual(counterReducer({ counter: 0 }, subtractOne), {
  counter: -1
});
assert.deepStrictEqual(counterReducer({ counter: 100 }, reset), { counter: 0 });
```

Since a standard pattern is to set a store to undefined to clear it, there is also a `reducerDefaultFn` that does the same as `reducerFn` but will pass a default state when undefined or null is passed as the current state.

```typescript
import { actionCreator } from "@nll/dux/Actions";
import { caseFn, reducerDefaultFn } from "@nll/dux/Reducers";
import * as assert from "assert";

type State = {
  counter: number;
};

const INITIAL_STATE: State = {
  counter: 0
};

const increment = actionCreator<number>("INCREMENT");

const counterReducer = reducerDefaultFn(
  INITIAL_STATE,
  caseFn(increment, (state, payload) => ({
    ...state,
    counter: state.counter + payload
  }))
);

assert.deepStrictEqual(counterReducer(undefined, increment(1)), { counter: 1 });
```

There is are also factories for automatically rigging up asynchronous actions with a slice of store. The `asyncReducerFactory` pattern utilizes Lenses from [monocle-ts](https://github.com/gcanti/monocle-ts) as well as the DatumEither adt from [@nll/datum](https://github.com/nullpub/datum), so further reading may be necessary to truly grok the power of this factory function.

```typescript
import { pending } from "@nll/datum/Datum";
import { DatumEither, initial, success } from "@nll/datum/DatumEither";
import { asyncActionCreators } from "@nll/dux/Actions";
import { asyncReducerFactory } from "@nll/dux/Reducers";
import * as assert from "assert";
import { Lens } from "monocle-ts";

type State = {
  apiData: DatumEither<string, number>;
};

const INITIAL_STATE: State = {
  apiData: initial
};

const getApiData = asyncActionCreators<number, number, string>("GET_API_DATA");

const apiDataLens = Lens.fromProp<State>()("apiData");

const apiDataReducer = asyncReducerFactory(getApiData, apiDataLens);

assert.deepStrictEqual(apiDataReducer(INITIAL_STATE, getApiData.pending(1)), {
  apiData: pending
});
assert.deepStrictEqual(
  apiDataReducer(INITIAL_STATE, getApiData.success({ params: 1, result: 20 })),
  {
    apiData: success(20)
  }
);
```

Last is the `asyncEntitiesReducer` which does the same as `asyncReducerFactory` but for a collection of data.

```typescript
import { pending } from "@nll/datum/Datum";
import { DatumEither, initial, success } from "@nll/datum/DatumEither";
import { asyncActionCreators } from "@nll/dux/Actions";
import { asyncEntityReducer } from "@nll/dux/Reducers";
import { createStore } from "@nll/dux/Store";
import * as assert from "assert";
import { Lens } from "monocle-ts";
import { take, toArray } from "rxjs/operators";

type State = {
  apiDatas: Record<string, DatumEither<string, number>>;
};

const INITIAL_STATE: State = {
  apiDatas: {}
};

const getApiData = asyncActionCreators<number, number, string>("GET_API_DATA");

const apiDataLens = Lens.fromProp<State>()("apiDatas");
const idLens = new Lens(
  (s: number) => s.toString(),
  a => s => parseInt(a, 10)
);

const apiDataReducer = asyncEntityReducer(getApiData, apiDataLens, idLens);
const store = createStore(INITIAL_STATE).addReducers(apiDataReducer);

// Test changes to the store.
store
  .select(s => s)
  .pipe(take(3), toArray())
  .subscribe(states =>
    assert.deepStrictEqual(states, [
      {
        apiDatas: {
          "1": initial
        }
      },
      {
        apiDatas: {
          "1": pending
        }
      },
      {
        apiDatas: {
          "1": success(20)
        }
      }
    ])
  );

store.dispatch(getApiData.pending(1), getApiData.success({ params: 1, result: 20 }));
```

At this point let's list what we've achieved:

1. Created a type-safe set of actions for pending, failure, and success states of an api call.
2. Created a reducer that manages a collection of api responses by key, with their associated pending states.

This is all done in `10 lines of code`. Of course, this doesn't include the actual api call, for that we'll need to look at Effects (soon).
