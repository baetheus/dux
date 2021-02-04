import * as assert from "assert";

import { pipe } from "../src/Utilities";

describe("Utilities", () => {
  it("pipe", () => {
    const addOne = (n: number): number => n + 1;

    assert.deepEqual(pipe(1), 1, "Pipe 1 Function");

    assert.deepEqual(pipe(1, addOne), 2, "Pipe 2 Functions");

    assert.deepEqual(pipe(1, addOne, addOne), 3, "Pipe 3 Functions");

    assert.deepEqual(pipe(1, addOne, addOne, addOne), 4, "Pipe 4 Functions");

    assert.deepEqual(
      pipe(1, addOne, addOne, addOne, addOne),
      5,
      "Pipe 5 Functions"
    );

    assert.deepEqual(
      pipe(1, addOne, addOne, addOne, addOne, addOne),
      6,
      "Pipe 6 Functions"
    );

    assert.deepEqual(
      pipe(1, addOne, addOne, addOne, addOne, addOne, addOne),
      7,
      "Pipe 7 Functions"
    );

    assert.deepEqual(
      pipe(1, addOne, addOne, addOne, addOne, addOne, addOne, addOne),
      8,
      "Pipe 8 Functions"
    );

    assert.deepEqual(
      pipe(1, addOne, addOne, addOne, addOne, addOne, addOne, addOne, addOne),
      9,
      "Pipe 9 Functions"
    );
  });
});
