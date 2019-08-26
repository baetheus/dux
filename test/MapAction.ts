import * as assert from 'assert';
import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';

import * as A from '../src/Actions';
import * as M from '../src/MapAction';

describe('MapAction', () => {
  it('mapAction', done => {
    const asyncAction = A.asyncActionCreators<number, number, number>('ASYNC');
    const otherAction = A.actionCreator<string>('OTHER');

    from([
      asyncAction.success({ params: 5, result: 20 }),
      asyncAction.pending(1),
    ])
      .pipe(
        M.mapAction(asyncAction.success, a => [
          otherAction(a.payload.params.toString()),
        ]),
        toArray()
      )
      .subscribe(as => {
        assert.deepStrictEqual(as, [
          asyncAction.success({ params: 5, result: 20 }),
          otherAction((5).toString()),
          asyncAction.pending(1),
        ]);
        done();
      });
  });
});
