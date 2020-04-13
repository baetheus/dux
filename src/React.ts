/**
 * React/Preact specific utilities for wrapping a Store in hooks.
 *
 * @since 8.0.0
 */

import { Store } from "./Store";
import { ActionCreator } from "./Actions";

type Fn<AS extends any[], R> = (...as: AS) => R;
type Ds<A> = Fn<[A], void>;

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
 * Type annotation for the React useCallback hook.
 * @since 8.1.0
 */
export type UseCallback<T extends Fn<any, any>> = (callback: T, deps: DependencyList) => T;

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

/**
 * @since 8.1.0
 */
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1>(...as: [ActionCreator<T1>]) => [Ds<T1>];
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1, T2>(...as: [ActionCreator<T1>, ActionCreator<T2>]) => [Ds<T1>, Ds<T2>];
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1, T2, T3>(
  ...as: [ActionCreator<T1>, ActionCreator<T2>, ActionCreator<T3>]
) => [Ds<T1>, Ds<T2>, Ds<T3>];
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1, T2, T3, T4>(
  ...as: [ActionCreator<T1>, ActionCreator<T2>, ActionCreator<T3>, ActionCreator<T4>]
) => [Ds<T1>, Ds<T2>, Ds<T3>, Ds<T4>];
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1, T2, T3, T4, T5>(
  ...as: [
    ActionCreator<T1>,
    ActionCreator<T2>,
    ActionCreator<T3>,
    ActionCreator<T4>,
    ActionCreator<T5>
  ]
) => [Ds<T1>, Ds<T2>, Ds<T3>, Ds<T4>, Ds<T5>];
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1, T2, T3, T4, T5, T6>(
  ...as: [
    ActionCreator<T1>,
    ActionCreator<T2>,
    ActionCreator<T3>,
    ActionCreator<T4>,
    ActionCreator<T5>,
    ActionCreator<T6>
  ]
) => [Ds<T1>, Ds<T2>, Ds<T3>, Ds<T4>, Ds<T5>, Ds<T6>];
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1, T2, T3, T4, T5, T6, T7>(
  ...as: [
    ActionCreator<T1>,
    ActionCreator<T2>,
    ActionCreator<T3>,
    ActionCreator<T4>,
    ActionCreator<T5>,
    ActionCreator<T6>,
    ActionCreator<T7>
  ]
) => [Ds<T1>, Ds<T2>, Ds<T3>, Ds<T4>, Ds<T5>, Ds<T6>, Ds<T7>];
export function useDispatchFactory<S>(
  store: Store<S>,
  useCallback: UseCallback<any>
): <T1, T2, T3, T4, T5, T6, T7, T8>(
  ...as: [
    ActionCreator<T1>,
    ActionCreator<T2>,
    ActionCreator<T3>,
    ActionCreator<T4>,
    ActionCreator<T5>,
    ActionCreator<T6>,
    ActionCreator<T7>,
    ActionCreator<T8>
  ]
) => [Ds<T1>, Ds<T2>, Ds<T3>, Ds<T4>, Ds<T5>, Ds<T6>, Ds<T7>, Ds<T7>];
export function useDispatchFactory<S>(store: Store<S>, useCallback: UseCallback<any>) {
  return function useDispatch(...as: ActionCreator<any>[]): Ds<any>[] {
    return as.map(ac => useCallback((p: any) => store.dispatch(ac(p)), [ac, store.dispatch]));
  };
}
