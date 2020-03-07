import * as assert from "assert";
import { from, of, throwError } from "rxjs";
import { delay, toArray } from "rxjs/operators";

import { actionCreatorFactory } from "../src/Actions";
import {
  asyncConcatMap,
  asyncExhaustMap,
  asyncMergeMap,
  asyncSwitchMap,
  mapAction,
  filterActions
} from "../src/Operators";

const creator = actionCreatorFactory("GROUP");
const asyncAction = creator.async<number, number, number>("ACTION");

describe("AsyncMap", () => {
  it("asyncConcatMap", done => {
    from([
      asyncAction.pending(1),
      asyncAction.success({ params: 100, result: 101 }),
      asyncAction.pending(2),
      asyncAction.failure({ params: 200, error: 0 })
    ])
      .pipe(
        asyncConcatMap(asyncAction, n =>
          n !== 2 ? of(n + 1).pipe(delay(100)) : throwError(n + 1).pipe(delay(200))
        ),
        toArray()
      )
      .subscribe(res => {
        assert.deepStrictEqual(res, [
          asyncAction.success({ params: 1, result: 2 }),
          asyncAction.failure({ params: 2, error: 3 })
        ]);
        done();
      });
  });

  it("asyncExhaustMap", done => {
    from([
      asyncAction.pending(1),
      asyncAction.success({ params: 100, result: 101 }),
      asyncAction.pending(2),
      asyncAction.failure({ params: 200, error: 0 })
    ])
      .pipe(
        asyncExhaustMap(asyncAction, n =>
          n !== 2 ? of(n + 1).pipe(delay(100)) : throwError(n + 1).pipe(delay(200))
        ),
        toArray()
      )
      .subscribe(res => {
        assert.deepStrictEqual(res, [asyncAction.success({ params: 1, result: 2 })]);
        done();
      });
  });

  it("asyncMergeMap", done => {
    from([
      asyncAction.pending(1),
      asyncAction.success({ params: 100, result: 101 }),
      asyncAction.pending(2),
      asyncAction.failure({ params: 200, error: 0 })
    ])
      .pipe(
        asyncMergeMap(asyncAction, n =>
          n !== 2 ? of(n + 1).pipe(delay(100)) : throwError(n + 1).pipe(delay(200))
        ),
        toArray()
      )
      .subscribe(res => {
        assert.deepStrictEqual(res, [
          asyncAction.failure({ params: 2, error: 3 }),
          asyncAction.success({ params: 1, result: 2 })
        ]);
        done();
      });
  });

  it("asyncSwitchMap", done => {
    from([
      asyncAction.pending(1),
      asyncAction.success({ params: 100, result: 101 }),
      asyncAction.pending(2),
      asyncAction.failure({ params: 200, error: 0 })
    ])
      .pipe(
        asyncSwitchMap(asyncAction, n =>
          n !== 2 ? of(n + 1).pipe(delay(100)) : throwError(n + 1).pipe(delay(200))
        ),
        toArray()
      )
      .subscribe(res => {
        assert.deepStrictEqual(res, [asyncAction.failure({ params: 2, error: 3 })]);
        done();
      });
  });

  it("mapAction", done => {
    const { simple, async } = actionCreatorFactory("TEST", { one: 1 });
    const asyncAction = async<number, number, number>("ASYNC");
    const otherAction = simple<string>("OTHER");

    from([asyncAction.success({ params: 5, result: 20 }), asyncAction.pending(1)])
      .pipe(
        mapAction(asyncAction.success, a => [otherAction(a.value.params.toString())]),
        toArray()
      )
      .subscribe(as => {
        assert.deepStrictEqual(as, [
          asyncAction.success({ params: 5, result: 20 }),
          otherAction((5).toString()),
          asyncAction.pending(1)
        ]);
        done();
      });
  });

  it("filterActions", done => {
    const { async } = actionCreatorFactory("TEST", { one: 1 });
    const asyncAction = async<number, number, number>("ASYNC");

    from([
      asyncAction.pending(1),
      asyncAction.success({ params: 5, result: 20 }),
      asyncAction.pending(2),
      asyncAction.failure({ params: 5, error: 0 })
    ])
      .pipe(filterActions(asyncAction.pending, asyncAction.success), toArray())
      .subscribe(as => {
        assert.deepStrictEqual(as, [
          asyncAction.pending(1),
          asyncAction.success({ params: 5, result: 20 }),
          asyncAction.pending(2)
        ]);
        done();
      });
  });
});
