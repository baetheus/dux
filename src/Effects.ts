/**
 * @since 5.0.0
 *
 * Grouped async action maps
 *
 * @deprecated
 */

import { Observable } from "rxjs";

import { AsyncActionCreators, Meta } from "./Actions";
import {
  asyncConcatMap,
  asyncExhaustMap,
  asyncMergeMap,
  asyncSwitchMap
} from "./AsyncMap";

/**
 * Generates asyncMap factories from an action
 *
 * @since 5.1.0
 *
 * @deprecated
 */
export const effectsFactory = <
  P = void,
  R = void,
  E = void,
  M extends Meta = Meta
>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P) => Observable<R>
) => ({
  asyncConcatMap: asyncConcatMap(action, project),
  asyncExhaustMap: asyncExhaustMap(action, project),
  asyncMergeMap: asyncMergeMap(action, project),
  asyncSwitchMap: asyncSwitchMap(action, project)
});
