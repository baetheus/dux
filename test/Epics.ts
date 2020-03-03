import * as assert from "assert";
import { of, throwError } from "rxjs";
import { take, delay, toArray } from "rxjs/operators";
import { Lens } from "monocle-ts";
import {
  initial,
  pending,
  success,
  toRefresh,
  failure,
  DatumEither
} from "@nll/datum/lib/DatumEither";

import { actionCreatorFactory } from "../src/Actions";
import { fromAsyncAction } from "../src/Epics";
import { createStore } from "../src/Store";
import { asyncReducerFactory } from "../src/Reducers";

const creator = actionCreatorFactory("GROUP");
const asyncAction = creator.async<number, number, number>("ACTION");

describe("Epics", () => {
  it("from", done => {
    type State = { count: DatumEither<unknown, number> };
    const state: State = { count: initial };
    const store = createStore(state);
    const reducer = asyncReducerFactory(
      asyncAction,
      Lens.fromProp<{ count: DatumEither<unknown, number> }>()("count")
    );
    const isItTwoEpic = fromAsyncAction(asyncAction, n => {
      return n !== 2
        ? of(n + 1).pipe(delay(100))
        : throwError(n + 1).pipe(delay(200));
    });
    store.addReducers(reducer);
    store.addEpics(isItTwoEpic);
    store
      .select(s => s.count)
      .pipe(take(5), toArray())
      .subscribe(
        n => {
          assert.deepStrictEqual(
            [initial, pending, success(2), toRefresh(success(2)), failure(3)],
            n
          );
        },
        assert.fail,
        done
      );

    store.dispatch(asyncAction.pending(1));
    setTimeout(() => store.dispatch(asyncAction.pending(2)), 300);
  });
});
