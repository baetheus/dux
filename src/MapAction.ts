import { from, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Action, ActionCreator, Meta } from './Actions';

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
