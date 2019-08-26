import * as assert from 'assert';
import { from } from 'rxjs';
import { toArray } from 'rxjs/operators';

import * as A from '../src/Actions';
import * as F from '../src/FilterActions';

describe('FilterActions', () => {
  it('filterActions', done => {
    const asyncAction = A.asyncActionCreators<number, number, number>('ASYNC');

    from([
      asyncAction.pending(1),
      asyncAction.success({ params: 5, result: 20 }),
      asyncAction.pending(2),
      asyncAction.failure({ params: 5, error: 0 }),
    ])
      .pipe(
        F.filterActions(asyncAction.pending, asyncAction.success),
        toArray()
      )
      .subscribe(as => {
        assert.deepStrictEqual(as, [
          asyncAction.pending(1),
          asyncAction.success({ params: 5, result: 20 }),
          asyncAction.pending(2),
        ]);
        done();
      });
  });
});
