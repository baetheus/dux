---
title: Effects.ts
nav_order: 3
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [effectsFactory (function)](#effectsfactory-function)

---

# effectsFactory (function)

Generates asyncMap factories from an action

**Signature**

```ts
export const effectsFactory = <
  P = void,
  R = void,
  E = void,
  M extends Meta = Meta
>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P) => Observable<R>
) => ...
```

Added in v5.1.0
