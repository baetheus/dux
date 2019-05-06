import { Alt2 } from 'fp-ts/lib/Alt';
import { Alternative2 } from 'fp-ts/lib/Alternative';
import { Applicative } from 'fp-ts/lib/Applicative';
import { array } from 'fp-ts/lib/Array';
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor';
import { Either } from 'fp-ts/lib/Either';
import { Extend2 } from 'fp-ts/lib/Extend';
import { Foldable2v2 } from 'fp-ts/lib/Foldable2v';
import { constFalse, Function1, Function2, identity, Lazy, Predicate } from 'fp-ts/lib/function';
import { HKT } from 'fp-ts/lib/HKT';
import { Monad2 } from 'fp-ts/lib/Monad';
import { Monoid } from 'fp-ts/lib/Monoid';
import { Monoidal2 } from 'fp-ts/lib/Monoidal';
import { Option } from 'fp-ts/lib/Option';
import { Ord } from 'fp-ts/lib/Ord';
import { sign } from 'fp-ts/lib/Ordering';
import { Semigroup } from 'fp-ts/lib/Semigroup';
import { Setoid } from 'fp-ts/lib/Setoid';
import { Traversable2v2 } from 'fp-ts/lib/Traversable2v';

import { AsyncData, AsyncFailure, AsyncPending, AsyncSuccess, URI } from './async-data-type';

// Constructor Functions
export const pending = <E, D>() => new AsyncPending<E, D>();
export const failure = <E, D>(error: E, refreshing = false) =>
  new AsyncFailure<E, D>(error, refreshing);
export const success = <E, D>(value: D, refreshing = false) =>
  new AsyncSuccess<E, D>(value, refreshing);

// Filter Functions
export const isFailure = <E, D>(
  data: AsyncData<E, D>
): data is AsyncFailure<E, D> => data.isFailure();
export const isSuccess = <E, D>(
  data: AsyncData<E, D>
): data is AsyncSuccess<E, D> => data.isSuccess();
export const isPending = <E, D>(
  data: AsyncData<E, D>
): data is AsyncPending<E, D> => data.isPending();

// Monad
const of = success;
const ap = <E, A, B>(
  fab: AsyncData<E, Function1<A, B>>,
  fa: AsyncData<E, A>
): AsyncData<E, B> => fa.ap(fab);
const map = <E, A, B>(
  fa: AsyncData<E, A>,
  f: Function1<A, B>
): AsyncData<E, B> => fa.map(f);
const chain = <E, A, B>(
  fa: AsyncData<E, A>,
  f: Function1<A, AsyncData<E, B>>
): AsyncData<E, B> => fa.chain(f);

// Foldable2v
const reduce = <E, A, B>(fa: AsyncData<E, A>, b: B, f: Function2<B, A, B>): B =>
  fa.reduce(b, f);
const foldMap = <M>(M: Monoid<M>) => <L, A>(
  fa: AsyncData<L, A>,
  f: (a: A) => M
): M => (fa.isSuccess() ? f(fa.value) : M.empty);
const foldr = <L, A, B>(fa: AsyncData<L, A>, b: B, f: (a: A, b: B) => B): B =>
  fa.isSuccess() ? f(fa.value, b) : b;

// Traversable2v
const traverse = <F>(F: Applicative<F>) => <E, A, B>(
  ta: AsyncData<E, A>,
  f: (a: A) => HKT<F, B>
): HKT<F, AsyncData<E, B>> =>
  ta.isSuccess()
    ? F.map<B, AsyncData<E, B>>(f(ta.value), of)
    : F.of((ta as unknown) as AsyncFailure<E, B> | AsyncPending<E, B>);
const sequence = <F>(F: Applicative<F>) => <E, A>(
  ta: AsyncData<E, HKT<F, A>>
): HKT<F, AsyncData<E, A>> => traverse(F)(ta, identity);

// Bifunctor
const bimap = <L, V, A, B>(
  fla: AsyncData<L, A>,
  f: (u: L) => V,
  g: (a: A) => B
): AsyncData<V, B> => fla.bimap(f, g);

// Alt
const alt = <L, A>(fx: AsyncData<L, A>, fy: AsyncData<L, A>): AsyncData<L, A> =>
  fx.alt(fy);

// Extend
const extend = <L, A, B>(
  fla: AsyncData<L, A>,
  f: Function1<AsyncData<L, A>, B>
): AsyncData<L, B> => fla.extend(f);

// Alternative
const zero = <L, A>(): AsyncData<L, A> => pending();

// Monoidal
const unit = <E, D>(): AsyncData<E, D> => pending();
const mult = <E, A, B>(
  fa: AsyncData<E, A>,
  fb: AsyncData<E, B>
): AsyncData<E, [A, B]> => combine(fa, fb);

// Setoid
export const getSetoid = <E, D>(
  SE: Setoid<E>,
  SD: Setoid<D>
): Setoid<AsyncData<E, D>> => {
  return {
    equals: (x, y) =>
      x.fold(
        y.fold(true, constFalse, constFalse), // TODO Look into getSetoid for Option because this is wrong
        xError =>
          y.fold(false, yError => SE.equals(xError, yError), constFalse),
        xValue => y.fold(false, constFalse, yValue => SD.equals(xValue, yValue))
      ),
  };
};

// Ord
export const getOrd = <E, D>(OE: Ord<E>, OD: Ord<D>): Ord<AsyncData<E, D>> => {
  return {
    ...getSetoid(OE, OD),
    compare: (x, y) =>
      sign(
        x.fold(
          y.fold(0, () => -1, () => -1),
          xError => y.fold(1, yError => OE.compare(xError, yError), () => -1),
          xValue => y.fold(1, () => 1, yValue => OD.compare(xValue, yValue))
        )
      ),
  };
};

// Semigroup
export const getSemigroup = <E, D>(
  SE: Semigroup<E>,
  SD: Semigroup<D>
): Semigroup<AsyncData<E, D>> => {
  return {
    concat: (x, y) => {
      return x.fold(
        y.fold(x, () => y, () => y),
        xError =>
          y.fold(x, yError => failure(SE.concat(xError, yError)), () => y),
        xValue =>
          y.fold(x, () => x, yValue => success(SD.concat(xValue, yValue)))
      );
    },
  };
};

// Monoid
export const getMonoid = <E, D>(
  SE: Semigroup<E>,
  SD: Semigroup<D>
): Monoid<AsyncData<E, D>> => {
  return {
    ...getSemigroup(SE, SD),
    empty: pending(),
  };
};

// From
export function fromOption<E, D>(
  option: Option<D>,
  error: Lazy<E>
): AsyncData<E, D> {
  if (option.isNone()) {
    return failure(error());
  } else {
    return success(option.value);
  }
}
export function fromEither<E, D>(either: Either<E, D>): AsyncData<E, D> {
  if (either.isLeft()) {
    return failure(either.value);
  } else {
    return success(either.value);
  }
}
export function fromPredicate<E, D>(
  predicate: Predicate<D>,
  whenFalse: Function1<D, E>
): Function1<D, AsyncData<E, D>> {
  return a => (predicate(a) ? success(a) : failure(whenFalse(a)));
}

//instance
export const asyncData: Monad2<URI> &
  Foldable2v2<URI> &
  Traversable2v2<URI> &
  Bifunctor2<URI> &
  Alt2<URI> &
  Extend2<URI> &
  Alternative2<URI> &
  Monoidal2<URI> = {
  // HKT
  URI,

  // Monad
  of,
  ap,
  map,
  chain,

  // Foldable2v
  reduce,
  foldMap,
  foldr,

  // Traversable2v
  traverse,
  sequence,

  // Bifunctor
  bimap,

  // Alt
  alt,

  // Alternative
  zero,

  // Extend
  extend,

  // Monoidal
  unit,
  mult,
};

export function combine<A, E>(a: AsyncData<E, A>): AsyncData<E, [A]>;
export function combine<A, B, E>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>
): AsyncData<E, [A, B]>;
export function combine<A, B, C, E>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>
): AsyncData<E, [A, B, C]>;
export function combine<A, B, C, D, E>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>
): AsyncData<E, [A, B, C, D]>;
export function combine<A, B, C, D, E, F>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>
): AsyncData<E, [A, B, C, D, F]>;
export function combine<A, B, C, D, E, F, G>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>,
  g: AsyncData<E, G>
): AsyncData<E, [A, B, C, D, F, G]>;
export function combine<A, B, C, D, E, F, G, H>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>,
  g: AsyncData<E, G>,
  h: AsyncData<E, H>
): AsyncData<E, [A, B, C, D, F, G, H]>;
export function combine<A, B, C, D, E, F, G, H, I>(
  a: AsyncData<E, A>,
  b: AsyncData<E, B>,
  c: AsyncData<E, C>,
  d: AsyncData<E, D>,
  f: AsyncData<E, F>,
  g: AsyncData<E, G>,
  h: AsyncData<E, H>,
  i: AsyncData<E, I>
): AsyncData<E, [A, B, C, D, F, G, H, I]>;
export function combine<T, E>(...list: AsyncData<E, T>[]): AsyncData<E, T[]> {
  if (list.length === 0) {
    return of([]);
  }
  return array.sequence(asyncData)(list);
}
