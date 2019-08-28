<p align="center">
  A functional toolkit for reducing boilerplate for Redux, Flux, Ngrx, and similar state management libraries.
</p>

<p align="center">
  <a href="https://travis-ci.org/nullpub/dux">
    <img src="https://img.shields.io/travis/nullpub/dux/master.svg" alt="build status" height="20">
  </a>
  <a href='https://coveralls.io/github/nullpub/dux?branch=master'><img src='https://coveralls.io/repos/github/nullpub/dux/badge.svg?branch=master' alt='Coverage Status' height="20"/></a>
  <a href="https://david-dm.org/nullpub/dux">
    <img src="https://img.shields.io/david/nullpub/dux.svg" alt="dependency status" height="20">
  </a>
  <a href="https://www.npmjs.com/package/@nll/dux">
    <img src="https://img.shields.io/npm/dm/@nll/dux.svg" alt="npm downloads" height="20">
  </a>
</p>

# @nll/dux

Flux and flux-like utilities

## Installation

```bash
npm i @nll/dux
```

To use async reducer factories you'll also need [monocle-ts](https://github.com/gcanti/monocle-ts), [fp-ts](https://github.com/gcanti/fp-ts) and [@nll/datum](https://github.com/nullpub/datum)

```bash
npm i monocle-ts fp-ts @nll/datum
```

To use some of the rxjs operators you'll need rxjs

```bash
npm i rxjs
```

If you plan on using everything here is the copypasta

```bash
npm i @nll/dux @nll/datum monocle-ts fp-ts
```

## Usage

### Action Creators

This library implements a similar pattern to [typescript-fsa](https://github.com/aikoven/typescript-fsa). The primary differences between this library and typescript-fsa are:

- The [action types](https://github.com/nullpub/dux/blob/master/src/Actions.ts) are easier to understand
- The meta parameter is fully typed
- The action factories themselves are built up in combinator style so new action patterns can be added without much fuss

Following is a sample of a simple increment action, here the type annotation tells TypeScript what the payload type is:

```typescript
import { actionCreator } from '@nll/dux/lib/Actions';
import * as assert from 'assert';

const increment = actionCreator<number>('INCREMENT');

assert.deepStrictEqual(increment(1), {
  type: 'INCREMENT',
  error: false,
  meta: {},
  payload: 1,
});
```

Here is an example of an action using meta, metadata is primarily useful for troubleshooting.

```typescript
import { actionCreator } from '@nll/dux/lib/Actions';
import * as assert from 'assert';

const increment = actionCreator<number>('INCREMENT');

assert.deepStrictEqual(increment(1, { from: 'HOME_PAGE' }), {
  type: 'INCREMENT',
  error: false,
  meta: {
    from: 'HOME_PAGE',
  },
  payload: 1,
});
```

All action creators also have a match function that acts as a [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types).

```typescript
import { actionCreator } from '@nll/dux/lib/Actions';
import * as assert from 'assert';

const increment = actionCreator<number>('INCREMENT');

const incrementAction = increment(1);

assert.equal(increment.match(incrementAction), true);
```

@nll/dux also includes asynchronous action creators, which fit nicely with the [flow pattern](https://medium.com/@gcanti/slaying-a-ui-antipattern-with-flow-5eed0cfb627b). Here the type annotations tell TypeScript what the `pending`, `failure`, and `success` types are.

```typescript
import { asyncActionCreators } from '@nll/dux/lib/Actions';
import * as assert from 'assert';

const increment = asyncActionCreators<number, number, string>('INCREMENT');

assert.deepStrictEqual(increment.pending(1), {
  type: 'INCREMENT/PENDING',
  error: false,
  meta: {},
  payload: 1,
});

assert.deepStrictEqual(
  increment.failure({ params: 1, error: 'Wrong Number!' }),
  {
    type: 'INCREMENT/FAILURE',
    error: true,
    meta: {},
    payload: {
      params: 1,
      error: 'Wrong Number!',
    },
  }
);

assert.deepStrictEqual(increment.success({ params: 1, result: 2 }), {
  type: 'INCREMENT/SUCCESS',
  error: false,
  meta: {},
  payload: {
    params: 1,
    result: 2,
  },
});
```

Lastly, @nll/dux includes a grouping factory, which is nice for when you want to create groups of actions.

```typescript
import { actionCreatorFactory } from '@nll/dux/lib/Actions';
import * as assert from 'assert';

const actionGroup = actionCreatorFactory('MY_GROUP_NAME');

const increment = actionGroup.simple<number>('INCREMENT');
const asyncIncrement = actionGroup.async<number, number, string>(
  'ASYNC_INCREMENT'
);

assert.deepStrictEqual(increment(1), {
  type: 'MY_GROUP_NAME/INCREMENT',
  error: false,
  meta: {},
  payload: 1,
});

assert.deepStrictEqual(asyncIncrement.pending(1), {
  type: 'MY_GROUP_NAME/INCREMENT/PENDING',
  error: false,
  meta: {},
  payload: 1,
});
```

## Documentation

- [Action Factories](https://nullpub.github.io/dux/modules/Actions.ts.html)
- [Reducer Factories](https://nullpub.github.io/dux/modules/Reducers.ts.html)
- [Effects Factories](https://nullpub.github.io/dux/modules/Effects.ts.html)
- [Rxjs AsyncMap Action Operators](https://nullpub.github.io/dux/modules/AsyncMap.ts.html)
- [Rxjs Filter Action Operators](https://nullpub.github.io/dux/modules/FilterActions.ts.html)
- [Rxjs Map Action Operators](https://nullpub.github.io/dux/modules/FilterActions.ts.html)
