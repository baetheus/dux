import * as assert from 'assert';
import { of, throwError } from 'rxjs';

import * as A from '../src/Actions';
import * as E from '../src/Effects';

describe('Effects', () => {
  it('effectsFactory', () => {
    const asyncAction = A.asyncActionCreators<number, number, number>('ASYNC');
    assert.doesNotThrow(() =>
      E.effectsFactory(asyncAction, n => (n === 2 ? throwError(0) : of(n + 1)))
    );
  });
});
