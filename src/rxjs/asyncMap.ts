import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { Action, ActionCreator, AsyncActionCreators, Meta } from '../actions/interfaces';

/**
 * Takes a lettable map operator and creates asyncMap operator
 *
 * @since 5.0.0
 */
const asyncMapFactory = (mapper: typeof mergeMap) => <P, R, E, M extends Meta>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P, meta: M) => Observable<R>
) => (obs: Observable<Action<any, any>>) =>
  obs.pipe(
    filter(action.pending.match),
    mapper(({ payload: params, meta }) =>
      project(params, meta).pipe(
        map(result => action.success({ params, result }, meta)),
        catchError(error => of(action.failure({ params, error }, meta)))
      )
    )
  );

/**
 * Wraps an asyncAction in a concatMap
 *
 * @since 5.0.0
 */
export const asyncConcatMap = asyncMapFactory(concatMap);

/**
 * Wraps an asyncAction in an exhaustMap
 *
 * @since 5.0.0
 */
export const asyncExhaustMap = asyncMapFactory(exhaustMap);

/**
 * Wraps an asyncAction in a mergeMap
 *
 * @since 5.0.0
 */
export const asyncMergeMap = asyncMapFactory(mergeMap);

/**
 * Wraps an asyncAction in a switchMap
 *
 * @since 5.0.0
 */
export const asyncSwitchMap = asyncMapFactory(switchMap);

/**
 * Filters on an action and a projection, and merges the output
 * of the projection with the original action.
 *
 * ie. originalAction => [originalAction, ...project(originalAction)]
 *
 * @since 5.0.0
 */
export const mapAction = <P, M extends Meta>(
  action: ActionCreator<P, M>,
  project: (action: Action<P, M>) => Action<any, any>[]
) => (obs: Observable<Action<any, any>>) =>
  obs.pipe(mergeMap(a => (action.match(a) ? from([a, ...project(a)]) : of(a))));
