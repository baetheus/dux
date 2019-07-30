---
title: async-data/async-data-fns.ts
nav_order: 5
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [asyncData (constant)](#asyncdata-constant)
- [combine (function)](#combine-function)
- [failure (function)](#failure-function)
- [fromEither (function)](#fromeither-function)
- [fromOption (function)](#fromoption-function)
- [fromPredicate (function)](#frompredicate-function)
- [initial (function)](#initial-function)
- [isFailure (function)](#isfailure-function)
- [isInitial (function)](#isinitial-function)
- [isPending (function)](#ispending-function)
- [isSuccess (function)](#issuccess-function)
- [pending (function)](#pending-function)
- [success (function)](#success-function)

---

# asyncData (constant)

HKT asyncData

**Signature**

```ts
export const asyncData: Monad2<URI> &
  Foldable2<URI> &
  Traversable2<URI> &
  Bifunctor2<URI> &
  Alt2<URI> &
  Extend2<URI> &
  Alternative2<URI> = ...
```

Added in v5.0.0

# combine (function)

combines AsyncData<_, _>[] into AsyncData<_, _[]>

**Signature**

```ts
export function combine<A, E>(a: AsyncData<E, A>): AsyncData<E, [A]>;
export function combine<A, B, E>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>
): AsyncData<E, [A, B]>;
export function combine<A, B, C, E>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>
): AsyncData<E, [A, B, C]>;
export function combine<A, B, C, D, E>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>
): AsyncData<E, [A, B, C, D]>;
export function combine<A, B, C, D, E, F>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>
): AsyncData<E, [A, B, C, D, F]>;
export function combine<A, B, C, D, E, F, G>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>,
  g: AsyncData<E, G>
): AsyncData<E, [A, B, C, D, F, G]>;
export function combine<A, B, C, D, E, F, G, H>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>,
  g: AsyncData<E, G>,
  h: AsyncData<E, H>
): AsyncData<E, [A, B, C, D, F, G, H]>;
export function combine<A, B, C, D, E, F, G, H, I>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>,
  g: AsyncData<E, G>,
  h: AsyncData<E, H>,
  i: AsyncData<E, I>
): AsyncData<E, [A, B, C, D, F, G, H, I]>; { ... }
```

Added in v5.0.0

# failure (function)

Creates AsyncFailure<E, D>

**Signature**

```ts
export const failure = <E, D>(error: E, refreshing = false) => ...
```

Added in v5.0.0

# fromEither (function)

From fromEither

**Signature**

```ts
export function fromEither<E, D>(either: E.Either<E, D>): AsyncData<E, D> { ... }
```

Added in v5.0.0

# fromOption (function)

From fromOption

**Signature**

```ts
export function fromOption<E, D>(option: O.Option<D>): AsyncData<E, D> { ... }
```

Added in v5.0.0

# fromPredicate (function)

From fromPredicate

**Signature**

```ts
export function fromPredicate<E, D>(
  predicate: Predicate<D>,
  whenFalse: FunctionN<[D], E>
): FunctionN<[D], AsyncData<E, D>> { ... }
```

Added in v5.0.0

# initial (function)

Creates AsyncInitial<E, D>

**Signature**

```ts
export const initial = <E, D>() => ...
```

Added in v5.0.0

# isFailure (function)

Filters for AsyncFailure<E, D>

**Signature**

```ts
export const isFailure = <E, D>(
  data: AsyncData<E, D>
): data is AsyncFailure<E, D> => ...
```

Added in v5.0.0

# isInitial (function)

Filters for AsyncInitial<E, D>

**Signature**

```ts
export const isInitial = <E, D>(
  data: AsyncData<E, D>
): data is AsyncInitial<E, D> => ...
```

Added in v5.0.0

# isPending (function)

Filters for AsyncSuccess<E, D>

**Signature**

```ts
export const isPending = <E, D>(
  data: AsyncData<E, D>
): data is AsyncPending<E, D> => ...
```

Added in v5.0.0

# isSuccess (function)

Filters for AsyncSuccess<E, D>

**Signature**

```ts
export const isSuccess = <E, D>(
  data: AsyncData<E, D>
): data is AsyncSuccess<E, D> => ...
```

Added in v5.0.0

# pending (function)

Creates AsyncPending<E, D>

**Signature**

```ts
export const pending = <E, D>() => ...
```

Added in v5.0.0

# success (function)

Creates AsyncSuccess<E, D>

**Signature**

```ts
export const success = <E, D>(value: D, refreshing = false) => ...
```

Added in v5.0.0
