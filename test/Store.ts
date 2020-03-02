import * as assert from "assert";
import { of, throwError } from "rxjs";
import { toArray, take, delay, tap } from "rxjs/operators";

import * as S from "../src/Store";
import * as R from "../src/Reducers";
import * as A from "../src/Actions";

type Store = { count: number; meta?: string };
const initStore: Store = { count: 0 };

const { simple } = A.actionCreatorFactory("TEST");
const ping = simple("PING");
const pong = simple("PONG");
const modify = simple<number>("MODIFY");
const reset = simple("RESET");

const countReducer = R.reducerFn<Store>(
  R.caseFn(modify, (s, a) => ({ count: s.count + a.value })),
  R.caseFn(reset, _ => initStore)
);

const metaPropReducer = R.reducerFn<Store>(
  R.caseFn(ping, (s, a) => {
    const meta = typeof a.meta.from === "string" ? a.meta.from : "unset";
    return { ...s, meta };
  })
);

const pingEpic: S.Epic<any> = a => {
  if (ping.match(a)) {
    return pong();
  }
};

const alterMetaReducer: S.MetaReducer<any> = r => (s, a) =>
  r(s, Object.assign(a, { meta: { from: "meta" } }));

describe("Store", () => {
  it("createStore", () => {
    assert.doesNotThrow(() => {
      S.createStore({ count: 0 })
        .addReducers(countReducer)
        .addMetaReducers(alterMetaReducer)
        .addEpics(pingEpic)
        .removeReducers(countReducer)
        .removeMetaReducers(alterMetaReducer)
        .removeEpics(pingEpic)
        .destroy();
    });
  });

  it("counts", done => {
    const store = S.createStore(initStore).addReducers(countReducer);

    store
      .select(s => s.count)
      .pipe(take(4), toArray())
      .subscribe(
        n => assert.deepStrictEqual([0, 1, 2, 3], n),
        assert.fail,
        () => done()
      );

    store.dispatch(modify(1));
    store.removeReducers(countReducer);
    store.dispatch(modify(2));
    store.addReducers(countReducer);
    store.dispatch(modify(1), modify(1));
  });

  it("epics", done => {
    const pingPongEpic: S.Epic<any> = (_, a) => {
      if (ping.match(a)) {
        return pong();
      }
      if (pong.match(a)) {
        return done();
      }
    };
    S.createStore({})
      .addEpics(pingPongEpic)
      .dispatch(ping());
  });

  it("cancels epics", done => {
    const foreverEpic: S.Epic<any> = () =>
      of(pong()).pipe(delay(500), tap(assert.fail));
    const store = S.createStore({}).addEpics(foreverEpic);
    store.dispatch(ping());
    setTimeout(() => {
      store.removeEpics(foreverEpic);
      done();
    }, 200);
  });

  it("epics promises", done => {
    const pingEpic: S.Epic<any> = async (_, a) => {
      if (ping.match(a)) {
        return pong();
      }
    };
    const pongEpic: S.Epic<any> = (_, a) => {
      if (pong.match(a)) {
        done();
      }
    };
    const store = S.createStore({}).addEpics(pingEpic, pongEpic);
    store.dispatch(ping());
  });

  it("handles rejecting epics", done => {
    assert.doesNotThrow(() => {
      const rejectEpic: S.Epic<any> = async () =>
        Promise.reject("You shall not pass!");
      const doneEpic: S.Epic<any> = (_, a) =>
        pong.match(a) ? done() : undefined;
      const store = S.createStore({}).addEpics(rejectEpic, doneEpic);
      store.dispatch(ping(), pong());
    });
  });

  it("handles throwError epics", done => {
    assert.doesNotThrow(() => {
      const rejectEpic: S.Epic<any> = () => throwError("You shall not pass!");
      const doneEpic: S.Epic<any> = (_, a) =>
        pong.match(a) ? done() : undefined;
      const store = S.createStore({}).addEpics(rejectEpic, doneEpic);
      store.dispatch(ping(), pong());
    });
  });

  it("metaReduces", done => {
    const store = S.createStore(initStore)
      .addReducers(metaPropReducer)
      .addMetaReducers(alterMetaReducer);

    store
      .select(s => s.meta)
      .pipe(take(3), toArray())
      .subscribe(
        n => assert.deepStrictEqual([undefined, "meta", "action"], n),
        assert.fail,
        done
      );

    store.dispatch(ping());
    store.removeMetaReducers(alterMetaReducer);
    store.dispatch(ping(null, { from: "action" }));
  });
});
