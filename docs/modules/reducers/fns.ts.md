---
title: reducers/fns.ts
nav_order: 11
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [caseFn (function)](#casefn-function)
- [casesFn (function)](#casesfn-function)
- [reducerDefaultFn (function)](#reducerdefaultfn-function)
- [reducerFn (function)](#reducerfn-function)

---

# caseFn (function)

Case function matches ActionCreator to handler.

**Signature**

```ts
export const caseFn = <S, P, M extends Meta>(
  action: ActionCreator<P, M>,
  handler: Handler<S, P>
): ActionReducer<S, P, M> => (s: S, a: Action<P, M>) => ...
```

Added in v5.0.0

# casesFn (function)

Case function matches multiple ActionCreators to a handler.

**Signature**

```ts
export const casesFn: CasesFn = <S>(
  actions: Array<ActionCreator<any, any>>,
  handler: Handler<S, any>
): ActionReducer<S, any, any> => (s: S, a: Action<any, any>) =>
  actions.some(({ match }) => ...
```

Added in v5.0.0

# reducerDefaultFn (function)

Compose caseFn and casesFn with initial state.

**Signature**

```ts
export const reducerDefaultFn = <S>(
  initialState: S,
  ...cases: Array<ActionReducer<S, any, any>>
) => (state: S | undefined = initialState, action: Action<any, any>): S =>
  cases.reduce((s, r) => ...
```

Added in v5.0.0

# reducerFn (function)

Compose caseFn and casesFn.

**Signature**

```ts
export const reducerFn: ReducerFn = <S>(
  ...cases: Array<ActionReducer<S, any, any>>
): ActionReducer<S, any, any> => (state: S, action: Action<any, any>) =>
  cases.reduce((s, r) => ...
```

Added in v5.0.0
