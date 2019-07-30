---
title: actions/utils.ts
nav_order: 4
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [isType (function)](#istype-function)

---

# isType (function)

Checks if the Action is from the ActionCreator.

**Signature**

```ts
export const isType = <P, M extends Meta>(
  actionCreator: ActionCreator<P, M>
) => (action: Action<any, any>): action is Action<P, M> => ...
```

Added in v5.0.0
