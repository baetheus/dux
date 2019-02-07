import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { Action, AsyncActionCreators, Meta, ActionCreator } from '../actions/interfaces';

/**
 * Takes a lettable map operator and creates asyncMap operator
 */
const asyncMapFactory = (mapper: typeof mergeMap) => <P, R, E, M extends Meta>(
  action: AsyncActionCreators<P, R, E, M>,
  project: (params: P) => Observable<R>
) => (obs: Observable<Action<any, any>>) =>
  obs.pipe(
    filter(action.pending.match),
    mapper(({ payload: params, meta }) =>
      project(params).pipe(
        map(result => action.success({ params, result }, meta)),
        catchError(error => of(action.failure({ params, error }, meta)))
      )
    )
  );

/**
 * Filters on the `pending` Action of the AsyncActionCreator.
 * Invokes the project (commonly a http request).
 * On success, returns the `success` Action
 * Else, returns the `failure` Action
 */
export const asyncConcatMap = asyncMapFactory(concatMap);
export const asyncExhaustMap = asyncMapFactory(exhaustMap);
export const asyncMergeMap = asyncMapFactory(mergeMap);
export const asyncSwitchMap = asyncMapFactory(switchMap);

export const mapAction = <P, M extends Meta>(
  action: ActionCreator<P, M>,
  project: (action: Action<P, M>) => Action<any, any>[],
  keepAction: boolean = true
) => (obs: Observable<Action<any, any>>) =>
  obs.pipe(
    filter(action.match),
    mergeMap(action => from((keepAction ? [action] : []).concat(project(action))))
  );
