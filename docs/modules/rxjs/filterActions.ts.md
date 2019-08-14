---
title: rxjs/filterActions.ts
nav_order: 12
parent: Modules
---

---

<h2 class="text-delta">Table of contents</h2>

- [FilterActions (interface)](#filteractions-interface)
- [filterActions (function)](#filteractions-function)

---

# FilterActions (interface)

Interface for the filterActions operator.

**Signature**

```ts
export interface FilterActions {
  <P1, M1 extends Meta>(a1: ActionCreator<P1, M1>): (
    source: Observable<Action<any, Meta>>
  ) => Observable<Action<P1, M1>>

  <P1, M1 extends Meta, P2, M2 extends Meta>(a1: ActionCreator<P1, M1>, a2: ActionCreator<P2, M2>): (
    source: Observable<Action<any, Meta>>
  ) => Observable<Action<P1, M1> | Action<P2, M2>>

  <P1, M1 extends Meta, P2, M2 extends Meta, P3, M3 extends Meta>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>
  ): (source: Observable<Action<any, Meta>>) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3>>

  <P1, M1 extends Meta, P2, M2 extends Meta, P3, M3 extends Meta, P4, M4 extends Meta>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>
  ): (
    source: Observable<Action<any, Meta>>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4>>

  <P1, M1 extends Meta, P2, M2 extends Meta, P3, M3 extends Meta, P4, M4 extends Meta, P5, M5 extends Meta>(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>
  ): (
    source: Observable<Action<any, Meta>>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4> | Action<P5, M5>>

  <
    P1,
    M1 extends Meta,
    P2,
    M2 extends Meta,
    P3,
    M3 extends Meta,
    P4,
    M4 extends Meta,
    P5,
    M5 extends Meta,
    P6,
    M6 extends Meta
  >(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>
  ): (
    source: Observable<Action<any, Meta>>
  ) => Observable<Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4> | Action<P5, M5> | Action<P6, M6>>

  <
    P1,
    M1 extends Meta,
    P2,
    M2 extends Meta,
    P3,
    M3 extends Meta,
    P4,
    M4 extends Meta,
    P5,
    M5 extends Meta,
    P6,
    M6 extends Meta,
    P7,
    M7 extends Meta
  >(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>
  ): (
    source: Observable<Action<any, Meta>>
  ) => Observable<
    Action<P1, M1> | Action<P2, M2> | Action<P3, M3> | Action<P4, M4> | Action<P5, M5> | Action<P6, M6> | Action<P7, M7>
  >

  <
    P1,
    M1 extends Meta,
    P2,
    M2 extends Meta,
    P3,
    M3 extends Meta,
    P4,
    M4 extends Meta,
    P5,
    M5 extends Meta,
    P6,
    M6 extends Meta,
    P7,
    M7 extends Meta,
    P8,
    M8 extends Meta
  >(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>,
    a8: ActionCreator<P8, M8>
  ): (
    source: Observable<Action<any, Meta>>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
    | Action<P6, M6>
    | Action<P7, M7>
    | Action<P8, M8>
  >

  <
    P1,
    M1 extends Meta,
    P2,
    M2 extends Meta,
    P3,
    M3 extends Meta,
    P4,
    M4 extends Meta,
    P5,
    M5 extends Meta,
    P6,
    M6 extends Meta,
    P7,
    M7 extends Meta,
    P8,
    M8 extends Meta,
    P9,
    M9 extends Meta
  >(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>,
    a8: ActionCreator<P8, M8>,
    a9: ActionCreator<P9, M9>
  ): (
    source: Observable<Action<any, Meta>>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
    | Action<P6, M6>
    | Action<P7, M7>
    | Action<P8, M8>
    | Action<P9, M9>
  >

  <
    P1,
    M1 extends Meta,
    P2,
    M2 extends Meta,
    P3,
    M3 extends Meta,
    P4,
    M4 extends Meta,
    P5,
    M5 extends Meta,
    P6,
    M6 extends Meta,
    P7,
    M7 extends Meta,
    P8,
    M8 extends Meta,
    P9,
    M9 extends Meta,
    P10,
    M10 extends Meta
  >(
    a1: ActionCreator<P1, M1>,
    a2: ActionCreator<P2, M2>,
    a3: ActionCreator<P3, M3>,
    a4: ActionCreator<P4, M4>,
    a5: ActionCreator<P5, M5>,
    a6: ActionCreator<P6, M6>,
    a7: ActionCreator<P7, M7>,
    a8: ActionCreator<P8, M8>,
    a9: ActionCreator<P9, M9>,
    a10: ActionCreator<P10, M10>
  ): (
    source: Observable<Action<any, Meta>>
  ) => Observable<
    | Action<P1, M1>
    | Action<P2, M2>
    | Action<P3, M3>
    | Action<P4, M4>
    | Action<P5, M5>
    | Action<P6, M6>
    | Action<P7, M7>
    | Action<P8, M8>
    | Action<P9, M9>
    | Action<P10, M10>
  >
}
```

Added in v5.0.0

# filterActions (function)

RxJS operator to filter acitons by multiple `ActionCreator`s.

**Signature**

```ts
export const filterActions: FilterActions = (
  ...actions: ActionCreator<any, any>[]
) => ...
```

Added in v5.0.0
