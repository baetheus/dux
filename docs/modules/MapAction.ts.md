---
title: MapAction.ts
nav_order: 5
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [mapAction (function)](#mapaction-function)

---

# mapAction (function)

Filters on an action and a projection, and merges the output
of the projection with the original action.

ie. originalAction => [originalAction, ...project(originalAction)]

**Signature**

```ts
export const mapAction = <P, M extends Meta>(
  action: ActionCreator<P, M>,
  project: (action: Action<P, M>) => Action<any, any>[]
) => (obs: Observable<Action<any, any>>) =>
  obs.pipe(mergeMap(a => ...
```

Added in v5.0.0
