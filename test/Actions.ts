import * as assert from "assert";

import {
  actionFactory,
  actionCreatorFactory,
  collapseType
} from "../src/Actions";

describe("Action", () => {
  it("actionFactory", () => {
    const factory1 = actionFactory<number>("HELLO", {}, true);
    const factory2 = actionFactory<number>("HELLO", {}, false);
    const factory3 = actionFactory<number>("HELLO", {});

    assert.deepStrictEqual(factory1(1), {
      type: "HELLO",
      value: 1,
      meta: {},
      error: true
    });
    assert.deepStrictEqual(factory2(1), {
      type: "HELLO",
      value: 1,
      meta: {},
      error: false
    });
    assert.deepStrictEqual(factory3(1), {
      type: "HELLO",
      value: 1,
      meta: {},
      error: false
    });
  });

  it("actionCreatorFactory", () => {
    const creator = actionCreatorFactory("GROUP", { foo: "bar" });
    const emptyAction = creator.simple("EMPTY");
    const simpleAction = creator.simple<number>("SIMPLE");
    const errorAction = creator.simple<number>("ERROR", {}, true);
    const asyncAction = creator.async<number, number, number>("ASYNC");

    assert.equal(simpleAction.match(simpleAction(1)), true);
    assert.equal(simpleAction.match(asyncAction.pending(1)), false);

    assert.deepStrictEqual(emptyAction(100), {
      type: "GROUP/EMPTY",
      meta: { foo: "bar" },
      value: 100,
      error: false
    });

    assert.deepStrictEqual(simpleAction(1), {
      type: "GROUP/SIMPLE",
      meta: { foo: "bar" },
      value: 1,
      error: false
    });
    assert.deepStrictEqual(simpleAction(2, { bar: "baz" }), {
      type: "GROUP/SIMPLE",
      meta: { foo: "bar", bar: "baz" },
      value: 2,
      error: false
    });
    assert.deepStrictEqual(simpleAction(3, { foo: "oof" }), {
      type: "GROUP/SIMPLE",
      meta: { foo: "oof" },
      value: 3,
      error: false
    });
    assert.deepStrictEqual(errorAction(3, { foo: "oof" }), {
      type: "GROUP/ERROR",
      meta: { foo: "oof" },
      value: 3,
      error: true
    });

    assert.deepStrictEqual(asyncAction.pending(1), {
      type: "GROUP/ASYNC/PENDING",
      meta: { foo: "bar" },
      value: 1,
      error: false
    });
    assert.deepStrictEqual(asyncAction.failure({ params: 1, error: 1 }), {
      type: "GROUP/ASYNC/FAILURE",
      meta: { foo: "bar" },
      value: {
        params: 1,
        error: 1
      },
      error: true
    });
    assert.deepStrictEqual(asyncAction.success({ params: 1, result: 1 }), {
      type: "GROUP/ASYNC/SUCCESS",
      meta: { foo: "bar" },
      value: {
        params: 1,
        result: 1
      },
      error: false
    });
  });

  it("collapseType", () => {
    assert.equal(collapseType(), "UNKNOWN_TYPE");
    assert.equal(collapseType("TYPE"), "TYPE");
    assert.equal(collapseType("TYPE", "TYPE"), "TYPE/TYPE");
  });
});
