import * as assert from "assert";
import { of, throwError, NEVER, EMPTY, Observable } from "rxjs";
import {
  mergeMap,
  toArray,
  take,
  delay,
  tap,
  filter,
  mapTo,
  withLatestFrom,
  mergeMapTo,
} from "rxjs/operators";

import * as S from "../src/Store";
import * as R from "../src/Reducers";
import * as A from "../src/Actions";

type Store = { count: number; meta?: string };
const initStore: Store = { count: 0 };
const ACTION$: Observable<A.TypedAction> = EMPTY;

const { simple } = A.actionCreatorFactory("TEST");
const ping = simple("PING");
const pong = simple("PONG");
const modify = simple<number>("MODIFY");
const reset = simple("RESET");

const countReducer = R.reducerFn<Store>(
  R.caseFn(modify, (s, a) => ({ count: s.count + a.value })),
  R.caseFn(reset, (_) => initStore)
);

const metaPropReducer = R.reducerFn<Store>(
  R.caseFn(ping, (s, a) => {
    const meta = typeof a.meta.from === "string" ? a.meta.from : "unset";
    return { ...s, meta };
  })
);

const pingRunEvery: S.RunEvery<any> = (a) => {
  if (ping.match(a)) {
    return pong({});
  }
};

const neverRun = () => NEVER;

const pingRunOnce: S.RunOnce<any> = (a$) =>
  a$.pipe(filter(ping.match), mapTo(pong(undefined)));

const alterMetaReducer: S.MetaReducer<any> = (r) => (s, a) =>
  r(s, Object.assign(a, { meta: { from: "meta" } }));

describe("Store", () => {
  it("createStore", () => {
    assert.doesNotThrow(() => {
      S.createStore({ count: 0 })
        .addReducers(countReducer)
        .addMetaReducers(alterMetaReducer)
        .addRunEverys(pingRunEvery)
        .addRunOnces(pingRunOnce)
        .removeReducers(countReducer)
        .removeMetaReducers(alterMetaReducer)
        .removeRunEverys(pingRunEvery)
        .removeRunOnces(pingRunOnce);
    });
  });

  it("destroys", (done) => {
    const store = S.createStore({ count: 0 })
      .addReducers(countReducer)
      .addMetaReducers(alterMetaReducer)
      .addRunEverys(pingRunEvery, neverRun)
      .addRunOnces(pingRunOnce, neverRun);

    store
      .select((s) => s.count)
      .subscribe((x) => {
        if (x > 0) {
          assert.fail("SHOULD NEVER CALL");
        }
      });
    setTimeout(() => {
      store.destroy();
      store.dispatch(modify(1));
      done();
    }, 200);
  });

  it("counts", (done) => {
    const store = S.createStore(initStore).addReducers(countReducer);

    store
      .select((s) => s.count)
      .pipe(take(4), toArray())
      .subscribe(
        (n) => assert.deepStrictEqual([0, 1, 2, 3], n),
        assert.fail,
        () => done()
      );

    store.dispatch(modify(1));
    store.removeReducers(countReducer);
    store.dispatch(modify(2));
    store.addReducers(countReducer);
    store.dispatch(modify(1), modify(1));
  });

  it("runOnce", (done) => {
    const doneRunOnce: S.RunOnce<any> = (a$) =>
      a$.pipe(
        filter(pong.match),
        tap(() => done()),
        filter(() => false)
      );
    S.createStore({})
      .addRunOnces(pingRunOnce, doneRunOnce)
      .dispatch(ping(null));
  });

  it("runOnce has correct order", (done) => {
    const modifyCheck: S.RunOnce<{ count: number }> = (a$, s$) =>
      a$.pipe(
        filter(modify.match),
        withLatestFrom(s$),
        tap(([a, s]) => {
          switch (a.value) {
            case 1:
              assert.deepStrictEqual(s, { count: 1 });
              break;
            case 2:
              assert.deepStrictEqual(s, { count: 2 });
              break;
          }
        }),
        mergeMapTo(ACTION$)
      );
    const store = S.createStore({ count: 0 })
      .addReducers(countReducer)
      .addRunOnces(modifyCheck);
    store.dispatch(modify(1), reset(null), modify(2), reset(null), modify(100));
    store
      .select((s) => s.count)
      .subscribe((c) => {
        if (c === 100) {
          store.destroy();
          done();
        }
      });
  });

  it("runOnce handles errors", (done) => {
    assert.doesNotThrow(() => {
      const throwingRunOnce: S.RunOnce<any> = (a$) =>
        a$.pipe(mergeMap(() => throwError("YOU SHALL NOT PASS!")));
      const store = S.createStore({}).addRunOnces(throwingRunOnce);
      store.dispatch(ping(null));
      setTimeout(() => {
        store.dispatch(pong(null));
        done();
      }, 200);
    });
  });

  it("runEvery", (done) => {
    const pingPongEpic: S.RunEvery<any> = (_, a) => {
      if (ping.match(a)) {
        return pong(null);
      }
      if (pong.match(a)) {
        done();
      }
    };
    S.createStore({})
      .addRunEverys(pingPongEpic)
      .dispatch(ping(null));
  });

  it("cancels runEvery", (done) => {
    const foreverEpic = () => of(pong(null)).pipe(delay(500), tap(assert.fail));
    const store = S.createStore({}).addRunEverys(foreverEpic);
    store.dispatch(ping(null));
    setTimeout(() => {
      store.removeRunEverys(foreverEpic);
      done();
    }, 200);
  });

  it("runEvery promises", (done) => {
    const pingRunEvery: S.RunEvery<any> = async (_, a) => {
      if (ping.match(a)) {
        return pong(null);
      }
    };
    const pongEpic: S.RunEvery<any> = async (_, a) => {
      if (pong.match(a)) {
        done();
      }
    };
    const store = S.createStore({}).addRunEverys(pingRunEvery, pongEpic);
    store.dispatch(ping(null));
  });

  it("handles rejecting runEvery", (done) => {
    assert.doesNotThrow(() => {
      const rejectEpic: S.RunEvery<any> = async () =>
        Promise.reject("You shall not pass!") as any;
      const doneEpic: S.RunEvery<any> = (_, a) =>
        pong.match(a) ? done() : undefined;
      const store = S.createStore({}).addRunEverys(rejectEpic, doneEpic);
      store.dispatch(ping(null), ping(null), pong(null));
    });
  });

  it("handles throwing runEvery", (done) => {
    assert.doesNotThrow(() => {
      const rejectEpic: S.RunEvery<any> = async () => {
        throw new Error("Busted");
      };
      const doneEpic: S.RunEvery<any> = (_, a) =>
        pong.match(a) ? done() : undefined;
      const store = S.createStore({}).addRunEverys(rejectEpic, doneEpic);
      store.dispatch(ping(null), ping(null), pong(null));
    });
  });

  it("handles throwError runEvery", (done) => {
    assert.doesNotThrow(() => {
      const rejectEpic: S.RunEvery<any> = () =>
        throwError("You shall not pass!");
      const doneEpic: S.RunEvery<any> = (_, a) =>
        pong.match(a) ? done() : undefined;
      const store = S.createStore({}).addRunEverys(rejectEpic, doneEpic);
      store.dispatch(ping(null), pong(null));
    });
  });

  it("metaReduces", (done) => {
    const store = S.createStore(initStore)
      .addReducers(metaPropReducer)
      .addMetaReducers(alterMetaReducer);

    store
      .select((s) => s.meta)
      .pipe(take(3), toArray())
      .subscribe(
        (n) => assert.deepStrictEqual([undefined, "meta", "action"], n),
        assert.fail,
        done
      );

    store.dispatch(ping(null));
    store.removeMetaReducers(alterMetaReducer);
    store.dispatch(ping(null, { from: "action" }));
  });

  it("getState", () => {
    const store = S.createStore({ count: 0 });
    assert.deepStrictEqual(store.getState(), { count: 0 });
  });

  it("setState", () => {
    const store = S.createStore({ count: 0 });
    store.setState({ count: 1 });
    assert.deepStrictEqual(store.getState(), { count: 1 });
  });

  it("destroys", (done) => {
    const store = S.createStore({ count: 0 }).addReducers(countReducer);
    store
      .select((s) => s.count)
      .subscribe((n) => {
        if (n > 0) {
          assert.fail("Selector should never be called with a value over 0.");
        }
      });
    store.destroy();
    setTimeout(() => {
      store.dispatch(modify(1));
      done();
    }, 200);
  });

  it("predicate select", (done) => {
    const store = S.createStore({ count: 0 }).addReducers(countReducer);
    store
      .select(
        (s) => s.count,
        () => false
      )
      .pipe(take(3), toArray())
      .subscribe(
        (result) => assert.deepStrictEqual([0, 0, 0], result),
        assert.fail,
        done
      );
    store.dispatch(modify(0), modify(0));
  });

  it("filterEvery", () => {
    const store = S.createStore({ count: 0 }).addRunEverys(
      S.filterEvery(modify, (_, a) => {
        assert.deepStrictEqual(a, modify(a.value));
      })
    );
    store.dispatch(modify(1), pong(null), modify(2));
  });
});
