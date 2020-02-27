import * as assert from "assert";
import { from } from "rxjs";
import { toArray } from "rxjs/operators";

import { actionCreatorFactory } from "../src/Actions";
import * as M from "../src/MapAction";

describe("MapAction", () => {
  it("mapAction", done => {
    const { simple, async } = actionCreatorFactory("TEST", { one: 1 });
    const asyncAction = async<number, number, number>("ASYNC");
    const otherAction = simple<string>("OTHER");

    from([
      asyncAction.success({ params: 5, result: 20 }),
      asyncAction.pending(1)
    ])
      .pipe(
        M.mapAction(asyncAction.success, a => [
          otherAction(a.value.params.toString())
        ]),
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
});
