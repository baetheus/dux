import {
  DatumEither,
  failure,
  initial,
  pending,
  success,
  toRefresh,
} from "@nll/datum/DatumEither";
import * as assert from "assert";
import { Lens } from "monocle-ts";

import { actionCreatorFactory } from "../src/Actions";
import * as R from "../src/Reducers";

const { simple, async } = actionCreatorFactory("TEST", { one: 1 });
const asyncAction = async<number, number, number>("ASYNC");
const otherAction = simple<number>("OTHER");
const anotherAction = simple<number>("ANOTHER");
const neverHandledAction = simple<any>("NEVER");

const caseFn = R.caseFn(otherAction, (s: number, a) => s + a.value);
const casesFn = R.casesFn(
  [otherAction, anotherAction],
  (s: number, a) => s + a.value
);

type State = {
  n: DatumEither<number, number>;
};
const idLens = new Lens(
  (s: State) => s.n,
  (n) => (s) => ({ n })
);

type EntityState = {
  ns: Record<string, DatumEither<number, number>>;
};
const entityLens = new Lens(
  (s: EntityState) => s.ns,
  (ns) => (s) => ({ ns })
);
const entityIdLens = new Lens(
  (s: number) => s.toString(),
  (a) => (s) => parseInt(a, 10)
);

describe("Reducers", () => {
  it("caseFn", () => {
    assert.equal(caseFn(0, otherAction(1)), 1);
  });

  it("casesFn", () => {
    assert.equal(casesFn(0, otherAction(1)), 1);
    assert.equal(casesFn(0, anotherAction(1)), 1);
    assert.equal(casesFn(0, neverHandledAction(1)), 0);
  });

  it("reducerFn", () => {
    const reducer = R.reducerFn(caseFn, casesFn);
    assert.equal(reducer(0, otherAction(1)), 2);
    assert.equal(reducer(0, anotherAction(1)), 1);
  });

  it("reducerDefaultFn", () => {
    const reducer = R.reducerDefaultFn(0, caseFn, casesFn);
    assert.equal(reducer(undefined, otherAction(1)), 2);
    assert.equal(reducer(undefined, anotherAction(1)), 1);
    assert.equal(reducer(0, otherAction(1)), 2);
    assert.equal(reducer(0, anotherAction(1)), 1);
  });

  // asyncReducerFactory
  it("asyncReducerFactory", () => {
    const asyncReducer = R.asyncReducerFactory(asyncAction, idLens);
    const reducer = R.reducerDefaultFn<State>({ n: initial }, asyncReducer);
    assert.deepStrictEqual(reducer(undefined, otherAction(1)), { n: initial });

    assert.deepStrictEqual(reducer(undefined, asyncAction.pending(1)), {
      n: pending,
    });
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.success({ params: 1, result: 2 })),
      {
        n: success(2),
      }
    );
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.failure({ params: 1, error: 2 })),
      {
        n: failure(2),
      }
    );

    assert.deepStrictEqual(reducer({ n: pending }, asyncAction.pending(1)), {
      n: pending,
    });
    assert.deepStrictEqual(
      reducer({ n: pending }, asyncAction.success({ params: 1, result: 2 })),
      {
        n: success(2),
      }
    );
    assert.deepStrictEqual(
      reducer({ n: pending }, asyncAction.failure({ params: 1, error: 2 })),
      {
        n: failure(2),
      }
    );

    assert.deepStrictEqual(reducer({ n: failure(1) }, asyncAction.pending(1)), {
      n: toRefresh(failure(1)),
    });
    assert.deepStrictEqual(
      reducer({ n: failure(1) }, asyncAction.success({ params: 1, result: 2 })),
      { n: success(2) }
    );
    assert.deepStrictEqual(
      reducer({ n: failure(1) }, asyncAction.failure({ params: 1, error: 2 })),
      { n: failure(2) }
    );

    assert.deepStrictEqual(reducer({ n: success(1) }, asyncAction.pending(1)), {
      n: toRefresh(success(1)),
    });
    assert.deepStrictEqual(
      reducer({ n: success(1) }, asyncAction.success({ params: 1, result: 2 })),
      { n: success(2) }
    );
    assert.deepStrictEqual(
      reducer({ n: success(1) }, asyncAction.failure({ params: 1, error: 2 })),
      { n: failure(2) }
    );
  });

  it("composeRecord", () => {
    const itemsLens = new Lens(
      (s: { items: Record<string, number> }) => s.items,
      (items) => (s) => ({ ...s, items })
    );
    const itemLens = R.composeRecord(itemsLens, 0);
    const state = { items: { a: 1 } };
    const modifiedState1 = { items: { a: 2 } };
    const modifiedState2 = { items: { a: 1, b: 1 } };

    assert.deepEqual(1, itemLens("a").get(state));
    assert.deepEqual(0, itemLens("b").get(state));

    assert.deepEqual(modifiedState1, itemLens("a").set(2)(state));
    assert.deepEqual(modifiedState2, itemLens("b").set(1)(state));
  });

  it("asyncEntityFactory", () => {
    const asyncReducer = R.asyncEntityFactory(
      asyncAction,
      entityLens,
      entityIdLens
    );
    const reducer = R.reducerDefaultFn<EntityState>(
      { ns: { "1": initial } },
      asyncReducer
    );

    assert.deepStrictEqual(reducer(undefined, otherAction(1)), {
      ns: {
        "1": initial,
      },
    });

    assert.deepStrictEqual(
      reducer(
        {
          ns: {
            "1": success(2),
          },
        },
        asyncAction.pending(1)
      ),
      {
        ns: {
          "1": toRefresh(success(2)),
        },
      }
    );

    assert.deepStrictEqual(reducer(undefined, asyncAction.pending(1)), {
      ns: {
        "1": pending,
      },
    });
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.success({ params: 1, result: 2 })),
      {
        ns: {
          "1": success(2),
        },
      }
    );
    assert.deepStrictEqual(
      reducer(undefined, asyncAction.failure({ params: 1, error: 2 })),
      {
        ns: {
          "1": failure(2),
        },
      }
    );
  });

  it("filterReducer", () => {
    const group1 = actionCreatorFactory("GROUP_1");
    const group2 = actionCreatorFactory("GROUP_2");

    const action1 = group1.simple<number>("ACTION");
    const action2 = group2.simple<number>("ACTION");

    const casesFn = R.casesFn([action1, action2], (s, a) => a.value);

    const filterGroup1 = R.filterReducer(group1.group, casesFn);
    const filterGroup2 = R.filterReducer(group2.group, casesFn);
    const filterAction1 = R.filterReducer(action1.tag, casesFn);
    const filterAction2 = R.filterReducer(action2.tag, casesFn);

    assert.deepStrictEqual(filterGroup1(0, action1(1)), 1);
    assert.deepStrictEqual(filterGroup1(0, action2(1)), 0);
    assert.deepStrictEqual(filterGroup2(0, action1(1)), 0);
    assert.deepStrictEqual(filterGroup2(0, action2(1)), 1);

    assert.deepStrictEqual(filterAction1(0, action1(1)), 1);
    assert.deepStrictEqual(filterAction1(0, action2(1)), 0);
    assert.deepStrictEqual(filterAction2(0, action1(1)), 0);
    assert.deepStrictEqual(filterAction2(0, action2(1)), 1);
  });
});
