---
title: async-data/async-data-type.ts
nav_order: 6
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [AsyncData (type alias)](#asyncdata-type-alias)
- [URI (type alias)](#uri-type-alias)
- [AsyncFailure (class)](#asyncfailure-class)
  - [isInitial (method)](#isinitial-method)
  - [isPending (method)](#ispending-method)
  - [isFailure (method)](#isfailure-method)
  - [isSuccess (method)](#issuccess-method)
  - [alt (method)](#alt-method)
  - [altL (method)](#altl-method)
  - [fold (method)](#fold-method)
  - [ap (method)](#ap-method)
  - [chain (method)](#chain-method)
  - [map (method)](#map-method)
  - [mapLeft (method)](#mapleft-method)
  - [bimap (method)](#bimap-method)
  - [reduce (method)](#reduce-method)
  - [extend (method)](#extend-method)
  - [getOrElse (method)](#getorelse-method)
  - [getOrElseL (method)](#getorelsel-method)
  - [toOption (method)](#tooption-method)
  - [toEither (method)](#toeither-method)
  - [toEitherL (method)](#toeitherl-method)
  - [toNullable (method)](#tonullable-method)
  - [toString (method)](#tostring-method)
  - [exists (method)](#exists-method)
- [AsyncInitial (class)](#asyncinitial-class)
  - [isInitial (method)](#isinitial-method-1)
  - [isPending (method)](#ispending-method-1)
  - [isFailure (method)](#isfailure-method-1)
  - [isSuccess (method)](#issuccess-method-1)
  - [alt (method)](#alt-method-1)
  - [altL (method)](#altl-method-1)
  - [fold (method)](#fold-method-1)
  - [ap (method)](#ap-method-1)
  - [chain (method)](#chain-method-1)
  - [map (method)](#map-method-1)
  - [mapLeft (method)](#mapleft-method-1)
  - [bimap (method)](#bimap-method-1)
  - [reduce (method)](#reduce-method-1)
  - [extend (method)](#extend-method-1)
  - [getOrElse (method)](#getorelse-method-1)
  - [getOrElseL (method)](#getorelsel-method-1)
  - [toOption (method)](#tooption-method-1)
  - [toEither (method)](#toeither-method-1)
  - [toEitherL (method)](#toeitherl-method-1)
  - [toNullable (method)](#tonullable-method-1)
  - [toString (method)](#tostring-method-1)
  - [exists (method)](#exists-method-1)
- [AsyncPending (class)](#asyncpending-class)
  - [isInitial (method)](#isinitial-method-2)
  - [isPending (method)](#ispending-method-2)
  - [isFailure (method)](#isfailure-method-2)
  - [isSuccess (method)](#issuccess-method-2)
  - [alt (method)](#alt-method-2)
  - [altL (method)](#altl-method-2)
  - [fold (method)](#fold-method-2)
  - [ap (method)](#ap-method-2)
  - [chain (method)](#chain-method-2)
  - [map (method)](#map-method-2)
  - [mapLeft (method)](#mapleft-method-2)
  - [bimap (method)](#bimap-method-2)
  - [reduce (method)](#reduce-method-2)
  - [extend (method)](#extend-method-2)
  - [getOrElse (method)](#getorelse-method-2)
  - [getOrElseL (method)](#getorelsel-method-2)
  - [toOption (method)](#tooption-method-2)
  - [toEither (method)](#toeither-method-2)
  - [toEitherL (method)](#toeitherl-method-2)
  - [toNullable (method)](#tonullable-method-2)
  - [toString (method)](#tostring-method-2)
  - [exists (method)](#exists-method-2)
- [AsyncSuccess (class)](#asyncsuccess-class)
  - [isInitial (method)](#isinitial-method-3)
  - [isPending (method)](#ispending-method-3)
  - [isFailure (method)](#isfailure-method-3)
  - [isSuccess (method)](#issuccess-method-3)
  - [alt (method)](#alt-method-3)
  - [altL (method)](#altl-method-3)
  - [fold (method)](#fold-method-3)
  - [ap (method)](#ap-method-3)
  - [chain (method)](#chain-method-3)
  - [map (method)](#map-method-3)
  - [mapLeft (method)](#mapleft-method-3)
  - [bimap (method)](#bimap-method-3)
  - [reduce (method)](#reduce-method-3)
  - [extend (method)](#extend-method-3)
  - [getOrElse (method)](#getorelse-method-3)
  - [getOrElseL (method)](#getorelsel-method-3)
  - [toOption (method)](#tooption-method-3)
  - [toEither (method)](#toeither-method-3)
  - [toEitherL (method)](#toeitherl-method-3)
  - [toNullable (method)](#tonullable-method-3)
  - [toString (method)](#tostring-method-3)
  - [exists (method)](#exists-method-3)
- [URI (constant)](#uri-constant)

---

# AsyncData (type alias)

AsyncData<E, D> sum type

**Signature**

```ts
export type AsyncData<E, D> = AsyncInitial<E, D> | AsyncPending<E, D> | AsyncSuccess<E, D> | AsyncFailure<E, D>
```

Added in v5.0.0

# URI (type alias)

URI type for AsyncData

**Signature**

```ts
export type URI = typeof URI
```

Added in v5.0.0

# AsyncFailure (class)

Async Failure
Encapsulates pure error state when there was no previous result

**Signature**

```ts
export class AsyncFailure<E, D> {
  constructor(readonly error: E, readonly refreshing = false) { ... }
  ...
}
```

Added in v5.0.0

## isInitial (method)

**Signature**

```ts
isInitial(): this is AsyncInitial<E, D> { ... }
```

Added in v5.0.0

## isPending (method)

**Signature**

```ts
isPending(): this is AsyncPending<E, D> { ... }
```

Added in v5.0.0

## isFailure (method)

**Signature**

```ts
isFailure(): this is AsyncFailure<E, D> { ... }
```

Added in v5.0.0

## isSuccess (method)

**Signature**

```ts
isSuccess(): this is AsyncSuccess<E, D> { ... }
```

Added in v5.0.0

## alt (method)

**Signature**

```ts
alt(fy: AsyncData<E, D>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## altL (method)

**Signature**

```ts
altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## fold (method)

**Signature**

```ts
fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B { ... }
```

Added in v5.0.0

## ap (method)

**Signature**

```ts
ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## chain (method)

**Signature**

```ts
chain<B>(_: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## map (method)

**Signature**

```ts
map<B>(_: FunctionN<[D], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## mapLeft (method)

**Signature**

```ts
mapLeft<M>(f: FunctionN<[E], M>): AsyncData<M, D> { ... }
```

Added in v5.0.0

## bimap (method)

**Signature**

```ts
bimap<V, B>(f: FunctionN<[E], V>, _: FunctionN<[D], B>): AsyncData<V, B> { ... }
```

Added in v5.0.0

## reduce (method)

**Signature**

```ts
reduce<B>(b: B, _: FunctionN<[B, D], B>): B { ... }
```

Added in v5.0.0

## extend (method)

**Signature**

```ts
extend<B>(_: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## getOrElse (method)

**Signature**

```ts
getOrElse(value: D): D { ... }
```

Added in v5.0.0

## getOrElseL (method)

**Signature**

```ts
getOrElseL(f: Lazy<D>): D { ... }
```

Added in v5.0.0

## toOption (method)

**Signature**

```ts
toOption(): Option<D> { ... }
```

Added in v5.0.0

## toEither (method)

**Signature**

```ts
toEither(_: E): Either<E, D> { ... }
```

Added in v5.0.0

## toEitherL (method)

**Signature**

```ts
toEitherL(_: Lazy<E>): Either<E, D> { ... }
```

Added in v5.0.0

## toNullable (method)

**Signature**

```ts
toNullable(): D | null { ... }
```

Added in v5.0.0

## toString (method)

**Signature**

```ts
toString(): string { ... }
```

Added in v5.0.0

## exists (method)

**Signature**

```ts
exists(_: Predicate<D>): boolean { ... }
```

Added in v5.0.0

# AsyncInitial (class)

AsyncInitial
Encapsulates initial state prior to loading

**Signature**

```ts
export class AsyncInitial<E, D> {
  constructor() { ... }
  ...
}
```

Added in v5.0.0

## isInitial (method)

**Signature**

```ts
isInitial(): this is AsyncInitial<E, D> { ... }
```

Added in v5.0.0

## isPending (method)

**Signature**

```ts
isPending(): this is AsyncPending<E, D> { ... }
```

Added in v5.0.0

## isFailure (method)

**Signature**

```ts
isFailure(): this is AsyncFailure<E, D> { ... }
```

Added in v5.0.0

## isSuccess (method)

**Signature**

```ts
isSuccess(): this is AsyncSuccess<E, D> { ... }
```

Added in v5.0.0

## alt (method)

**Signature**

```ts
alt(fy: AsyncData<E, D>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## altL (method)

**Signature**

```ts
altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## fold (method)

**Signature**

```ts
fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B { ... }
```

Added in v5.0.0

## ap (method)

**Signature**

```ts
ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## chain (method)

**Signature**

```ts
chain<B>(f: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## map (method)

**Signature**

```ts
map<B>(f: FunctionN<[D], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## mapLeft (method)

**Signature**

```ts
mapLeft<M>(_: FunctionN<[E], M>): AsyncData<M, D> { ... }
```

Added in v5.0.0

## bimap (method)

**Signature**

```ts
bimap<V, B>(_: FunctionN<[E], V>, __: FunctionN<[D], B>): AsyncData<V, B> { ... }
```

Added in v5.0.0

## reduce (method)

**Signature**

```ts
reduce<B>(b: B, _: FunctionN<[B, D], B>): B { ... }
```

Added in v5.0.0

## extend (method)

**Signature**

```ts
extend<B>(f: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## getOrElse (method)

**Signature**

```ts
getOrElse(value: D): D { ... }
```

Added in v5.0.0

## getOrElseL (method)

**Signature**

```ts
getOrElseL(f: Lazy<D>): D { ... }
```

Added in v5.0.0

## toOption (method)

**Signature**

```ts
toOption(): Option<D> { ... }
```

Added in v5.0.0

## toEither (method)

**Signature**

```ts
toEither(err: E): Either<E, D> { ... }
```

Added in v5.0.0

## toEitherL (method)

**Signature**

```ts
toEitherL(err: Lazy<E>): Either<E, D> { ... }
```

Added in v5.0.0

## toNullable (method)

**Signature**

```ts
toNullable(): D | null { ... }
```

Added in v5.0.0

## toString (method)

**Signature**

```ts
toString(): string { ... }
```

Added in v5.0.0

## exists (method)

**Signature**

```ts
exists(_: Predicate<D>): boolean { ... }
```

Added in v5.0.0

# AsyncPending (class)

AsyncPending
Encapsulates loading state with no data

**Signature**

```ts
export class AsyncPending<E, D> {
  constructor() { ... }
  ...
}
```

Added in v5.0.0

## isInitial (method)

**Signature**

```ts
isInitial(): this is AsyncInitial<E, D> { ... }
```

Added in v5.0.0

## isPending (method)

**Signature**

```ts
isPending(): this is AsyncPending<E, D> { ... }
```

Added in v5.0.0

## isFailure (method)

**Signature**

```ts
isFailure(): this is AsyncFailure<E, D> { ... }
```

Added in v5.0.0

## isSuccess (method)

**Signature**

```ts
isSuccess(): this is AsyncSuccess<E, D> { ... }
```

Added in v5.0.0

## alt (method)

**Signature**

```ts
alt(fy: AsyncData<E, D>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## altL (method)

**Signature**

```ts
altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## fold (method)

**Signature**

```ts
fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B { ... }
```

Added in v5.0.0

## ap (method)

**Signature**

```ts
ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## chain (method)

**Signature**

```ts
chain<B>(f: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## map (method)

**Signature**

```ts
map<B>(f: FunctionN<[D], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## mapLeft (method)

**Signature**

```ts
mapLeft<M>(_: FunctionN<[E], M>): AsyncData<M, D> { ... }
```

Added in v5.0.0

## bimap (method)

**Signature**

```ts
bimap<V, B>(_: FunctionN<[E], V>, __: FunctionN<[D], B>): AsyncData<V, B> { ... }
```

Added in v5.0.0

## reduce (method)

**Signature**

```ts
reduce<B>(b: B, _: FunctionN<[B, D], B>): B { ... }
```

Added in v5.0.0

## extend (method)

**Signature**

```ts
extend<B>(f: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## getOrElse (method)

**Signature**

```ts
getOrElse(value: D): D { ... }
```

Added in v5.0.0

## getOrElseL (method)

**Signature**

```ts
getOrElseL(f: Lazy<D>): D { ... }
```

Added in v5.0.0

## toOption (method)

**Signature**

```ts
toOption(): Option<D> { ... }
```

Added in v5.0.0

## toEither (method)

**Signature**

```ts
toEither(err: E): Either<E, D> { ... }
```

Added in v5.0.0

## toEitherL (method)

**Signature**

```ts
toEitherL(err: Lazy<E>): Either<E, D> { ... }
```

Added in v5.0.0

## toNullable (method)

**Signature**

```ts
toNullable(): D | null { ... }
```

Added in v5.0.0

## toString (method)

**Signature**

```ts
toString(): string { ... }
```

Added in v5.0.0

## exists (method)

**Signature**

```ts
exists(_: Predicate<D>): boolean { ... }
```

Added in v5.0.0

# AsyncSuccess (class)

AsyncSuccess
Encapsulates the only state that has result data

**Signature**

```ts
export class AsyncSuccess<E, D> {
  constructor(readonly value: D, readonly refreshing = false) { ... }
  ...
}
```

Added in v5.0.0

## isInitial (method)

**Signature**

```ts
isInitial(): this is AsyncInitial<E, D> { ... }
```

Added in v5.0.0

## isPending (method)

**Signature**

```ts
isPending(): this is AsyncPending<E, D> { ... }
```

Added in v5.0.0

## isFailure (method)

**Signature**

```ts
isFailure(): this is AsyncFailure<E, D> { ... }
```

Added in v5.0.0

## isSuccess (method)

**Signature**

```ts
isSuccess(): this is AsyncSuccess<E, D> { ... }
```

Added in v5.0.0

## alt (method)

**Signature**

```ts
alt(_: AsyncData<E, D>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## altL (method)

**Signature**

```ts
altL(_: Lazy<AsyncData<E, D>>): AsyncData<E, D> { ... }
```

Added in v5.0.0

## fold (method)

**Signature**

```ts
fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B { ... }
```

Added in v5.0.0

## ap (method)

**Signature**

```ts
ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## chain (method)

**Signature**

```ts
chain<B>(f: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## map (method)

**Signature**

```ts
map<B>(f: FunctionN<[D], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## mapLeft (method)

**Signature**

```ts
mapLeft<M>(_: FunctionN<[E], M>): AsyncData<M, D> { ... }
```

Added in v5.0.0

## bimap (method)

**Signature**

```ts
bimap<V, B>(_: (e: E) => V, g: (d: D) => B): AsyncData<V, B> { ... }
```

Added in v5.0.0

## reduce (method)

**Signature**

```ts
reduce<B>(b: B, f: FunctionN<[B, D], B>): B { ... }
```

Added in v5.0.0

## extend (method)

**Signature**

```ts
extend<B>(f: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> { ... }
```

Added in v5.0.0

## getOrElse (method)

**Signature**

```ts
getOrElse(_: D): D { ... }
```

Added in v5.0.0

## getOrElseL (method)

**Signature**

```ts
getOrElseL(_: Lazy<D>): D { ... }
```

Added in v5.0.0

## toOption (method)

**Signature**

```ts
toOption(): Option<D> { ... }
```

Added in v5.0.0

## toEither (method)

**Signature**

```ts
toEither(_: E): Either<E, D> { ... }
```

Added in v5.0.0

## toEitherL (method)

**Signature**

```ts
toEitherL(_: Lazy<E>): Either<E, D> { ... }
```

Added in v5.0.0

## toNullable (method)

**Signature**

```ts
toNullable(): D | null { ... }
```

Added in v5.0.0

## toString (method)

**Signature**

```ts
toString(): string { ... }
```

Added in v5.0.0

## exists (method)

**Signature**

```ts
exists(f: Predicate<D>): boolean { ... }
```

Added in v5.0.0

# URI (constant)

URI const for AsyncData

**Signature**

```ts
export const URI: "AsyncData" = ...
```

Added in v5.0.0
