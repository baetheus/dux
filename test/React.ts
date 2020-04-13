import * as assert from "assert";
import * as R from "../src/React";
import * as S from "../src/Store";
import * as A from "../src/Actions";

const isCallable = <S, AS extends any[]>(s: S | ((...as: AS) => S)): s is (...as: AS) => S =>
  typeof s === "function";

const useState: R.UseState = initialState => {
  let state = isCallable(initialState) ? initialState() : initialState;
  return [
    state,
    v => {
      if (isCallable(v)) {
        state = v(state);
      } else {
        state = v;
      }
    }
  ];
};

const useEffect: R.UseEffect = (eff, _) => {
  const unsub = eff();
  if (isCallable(unsub)) {
    unsub();
  }
};

const useCallback: R.UseCallback<any> = (fn: any, _: R.DependencyList) => fn;

describe("React", () => {
  it("hooks", () => {
    const store = S.createStore({ count: 0 });

    assert.doesNotThrow(() => {
      const useStore = R.useStoreFactory(store, useState, useEffect);
      useStore(s => s.count);
    });
  });

  it("dispatches", done => {
    const creator = A.actionCreatorFactory("MY_GROUP");
    const action = creator.simple<number>("TEST_ACTION");

    const store = S.createStore({ count: 0 }).addRunEverys((_, a) => {
      if (action.match(a)) {
        done();
      }
    });

    assert.doesNotThrow(() => {
      const useDispatch = R.useDispatchFactory(store, useCallback);
      const [a] = useDispatch(action);
      console.log(a(1));
    });
  });
});
