/**
 * React/Preact specific utilities for wrapping a Store in hooks.
 *
 * @since 8.0.0
 */

import { Store } from "./Store";

/**
 * Type annotation for React Dispatch
 * @since 8.0.0
 */
export type Dispatch<A> = (value: A) => void;

/**
 * Type annotation for React SetStateAction
 * @since 8.0.0
 */
export type SetStateAction<S> = S | ((prevState: S) => S);

/**
 * Type annotation for the React useState hook.
 * @since 8.0.0
 */
export type UseState = <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];

/**
 * Type annotation for React EffectCallback
 * @since 8.0.0
 */
export type EffectCallback = () => void | (() => void | undefined);

/**
 * Type annotation for React DependencyList
 * @since 8.0.0
 */
export type DependencyList = ReadonlyArray<any>;

/**
 * Type annotation for the React useEffect hook.
 * @since 8.0.0
 */
export type UseEffect = (effect: EffectCallback, deps?: DependencyList) => void;

/**
 * Creates a useStore hook.
 *
 * First function takes a store instance, a useState hook, and a useEffect hook. It
 * then returns a useStore hook.
 *
 * Second function takes a selector and an optional comparator and
 * returns the output of the selector and the store's dispatch function
 *
 * Updates only when comparator detects a change (by default on strict equality change)
 * @since 8.0.0
 */
export const useStoreFactory = <S>(store: Store<S>, useState: UseState, useEffect: UseEffect) =>
  function useStore<O>(selector: (s: S) => O, comparator?: (p: O, n: O) => boolean) {
    const { dispatch, select, getState } = store;
    const [state, setState] = useState<O>(selector(getState()));

    useEffect(() => {
      const sub = select(selector, comparator).subscribe(setState);
      return () => sub.unsubscribe();
    }, [store, selector, comparator]);

    return [state, dispatch] as [typeof state, typeof dispatch];
  };
