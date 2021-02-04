---
title: Utilities.ts
nav_order: 6
parent: Modules
---

## Utilities overview

Added in v8.2.0

Internal utility functions reproduced to keep bundle dependencies small

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [PipeFn (type alias)](#pipefn-type-alias)
  - [apply1](#apply1)
  - [pipe](#pipe)

---

# utils

## PipeFn (type alias)

**Signature**

```ts
export type PipeFn = {
  <A>(a: A): A
  <A, B>(a: A, ab: (a: A) => B): B
  <A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
  <A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D
  <A, B, C, D, E>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E): E
  <A, B, C, D, E, F>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F): F
  <A, B, C, D, E, F, G>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
  ): G
  <A, B, C, D, E, F, G, H>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
  ): H
  <A, B, C, D, E, F, G, H, I>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
  ): I
  <A, B, C, D, E, F, G, H, I, J>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
  ): J
  <A, B, C, D, E, F, G, H, I, J, K>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K
  ): K
  <A, B, C, D, E, F, G, H, I, J, K, L>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (K: K) => L
  ): L
  <A, B, C, D, E, F, G, H, I, J, K, L>(
    a: A,
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (K: K) => L,
    end: never
  ): L
}
```

Added in v8.2.0

Internal utility functions reproduced to keep bundle dependencies small

## apply1

Takes an argument and a function and applies the argument to the function

**Signature**

```ts
export declare const apply1: <A, B>(a: A, fn: (a: A) => B) => B
```

Added in v8.2.0

## pipe

The canonical pipe function, reproduced to keep the bundle size of

**Signature**

```ts
export declare const pipe: PipeFn
```

Added in v8.2.0
