import { Alt2 } from 'fp-ts/lib/Alt';
import { Alternative2 } from 'fp-ts/lib/Alternative';
import { Applicative } from 'fp-ts/lib/Applicative';
import { array } from 'fp-ts/lib/Array';
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor';
import * as E from 'fp-ts/lib/Either';
import { Extend2 } from 'fp-ts/lib/Extend';
import { Foldable2 } from 'fp-ts/lib/Foldable';
import { FunctionN, identity, Predicate } from 'fp-ts/lib/function';
import { HKT } from 'fp-ts/lib/HKT';
import { Monad2 } from 'fp-ts/lib/Monad';
import { Monoid } from 'fp-ts/lib/Monoid';
import * as O from 'fp-ts/lib/Option';
import { Traversable2 } from 'fp-ts/lib/Traversable';

import { AsyncData, AsyncFailure, AsyncInitial, AsyncPending, AsyncSuccess, URI } from './async-data-type';

/**
 * Creates AsyncInitial<E, D>
 *
 * @since 5.0.0
 */
export const initial = <E, D>(): AsyncData<E, D> => new AsyncInitial<E, D>();

/**
 * Creates AsyncPending<E, D>
 *
 * @since 5.0.0
 */
export const pending = <E, D>(): AsyncData<E, D> => new AsyncPending<E, D>();

/**
 * Creates AsyncFailure<E, D>
 *
 * @since 5.0.0
 */
export const failure = <E, D>(error: E, refreshing = false): AsyncData<E, D> =>
  new AsyncFailure<E, D>(error, refreshing);

/**
 * Creates AsyncSuccess<E, D>
 *
 * @since 5.0.0
 */

export const success = <E, D>(value: D, refreshing = false): AsyncData<E, D> =>
  new AsyncSuccess<E, D>(value, refreshing);

/**
 * Filters for AsyncInitial<E, D>
 *
 * @since 5.0.0
 */
export const isInitial = <E, D>(
  data: AsyncData<E, D>
): data is AsyncInitial<E, D> => data.isInitial();

/**
 * Filters for AsyncFailure<E, D>
 *
 * @since 5.0.0
 */
export const isFailure = <E, D>(
  data: AsyncData<E, D>
): data is AsyncFailure<E, D> => data.isFailure();

/**
 * Filters for AsyncSuccess<E, D>
 *
 * @since 5.0.0
 */
export const isSuccess = <E, D>(
  data: AsyncData<E, D>
): data is AsyncSuccess<E, D> => data.isSuccess();

/**
 * Filters for AsyncSuccess<E, D>
 *
 * @since 5.0.0
 */
export const isPending = <E, D>(
  data: AsyncData<E, D>
): data is AsyncPending<E, D> => data.isPending();

/**
 * Monad of
 *
 * @since 5.0.0
 */
const of = success;

/**
 * Monad ap
 *
 * @since 5.0.0
 */
const ap = <E, A, B>(
  fab: AsyncData<E, FunctionN<[A], B>>,
  fa: AsyncData<E, A>
): AsyncData<E, B> => fa.ap(fab);

/**
 * Mappable map
 *
 * @since 5.0.0
 */
const map = <E, A, B>(
  fa: AsyncData<E, A>,
  f: FunctionN<[A], B>
): AsyncData<E, B> => fa.map(f);

/**
 * Monad chain
 *
 * @since 5.0.0
 */
const chain = <E, A, B>(
  fa: AsyncData<E, A>,
  f: FunctionN<[A], AsyncData<E, B>>
): AsyncData<E, B> => fa.chain(f);

/**
 * Foldable reduce
 *
 * @since 5.0.0
 */
const reduce = <E, A, B>(
  fa: AsyncData<E, A>,
  b: B,
  f: FunctionN<[B, A], B>
): B => fa.reduce(b, f);

/**
 * Foldable foldMap
 *
 * @since 5.0.0
 */
const foldMap = <M>(M: Monoid<M>) => <L, A>(
  fa: AsyncData<L, A>,
  f: (a: A) => M
): M => (fa.isSuccess() ? f(fa.value) : M.empty);

/**
 * Foldable reduceRight
 *
 * @since 5.0.0
 */
const reduceRight = <L, A, B>(
  fa: AsyncData<L, A>,
  b: B,
  f: (a: A, b: B) => B
): B => (fa.isSuccess() ? f(fa.value, b) : b);

/**
 * Traversable traverse
 *
 * @since 5.0.0
 */
const traverse = <F>(F: Applicative<F>) => <E, A, B>(
  ta: AsyncData<E, A>,
  f: (a: A) => HKT<F, B>
): HKT<F, AsyncData<E, B>> =>
  ta.isSuccess()
    ? F.map<B, AsyncData<E, B>>(f(ta.value), of)
    : F.of((ta as unknown) as
        | AsyncFailure<E, B>
        | AsyncPending<E, B>
        | AsyncInitial<E, B>);

/**
 * Traversable sequence
 *
 * @since 5.0.0
 */
const sequence = <F>(F: Applicative<F>) => <E, A>(
  ta: AsyncData<E, HKT<F, A>>
): HKT<F, AsyncData<E, A>> => traverse(F)(ta, identity);

/**
 * Bifunctor bimap
 *
 * @since 5.0.0
 */
const bimap = <L, V, A, B>(
  fla: AsyncData<L, A>,
  f: (u: L) => V,
  g: (a: A) => B
): AsyncData<V, B> => fla.bimap(f, g);

/**
 * Bifunctor mapLeft
 *
 * @since 5.0.0
 */
const mapLeft = <E, D, V>(
  ma: AsyncData<E, D>,
  fa: FunctionN<[E], V>
): AsyncData<V, D> => ma.mapLeft(fa);

/**
 * Alt alt
 *
 * @since 5.0.0
 */
const alt = <L, A>(
  fx: AsyncData<L, A>,
  fy: FunctionN<[], AsyncData<L, A>>
): AsyncData<L, A> => fx.alt(fy());

/**
 * Extend extend
 *
 * @since 5.0.0
 */
const extend = <L, A, B>(
  fla: AsyncData<L, A>,
  f: FunctionN<[AsyncData<L, A>], B>
): AsyncData<L, B> => fla.extend(f);

/**
 * Alternative zero
 *
 * @since 5.0.0
 */
const zero = <L, A>(): AsyncData<L, A> => initial();

/**
 * From fromOption
 *
 * @since 5.0.0
 */
export function fromOption<E, D>(option: O.Option<D>): AsyncData<E, D> {
  if (O.isNone(option)) {
    return initial();
  } else {
    return success(option.value);
  }
}

/**
 * From fromEither
 *
 * @since 5.0.0
 */
export function fromEither<E, D>(either: E.Either<E, D>): AsyncData<E, D> {
  if (E.isLeft(either)) {
    return failure(either.left);
  } else {
    return success(either.right);
  }
}

/**
 * From fromPredicate
 *
 * @since 5.0.0
 */
export function fromPredicate<E, D>(
  predicate: Predicate<D>,
  whenFalse: FunctionN<[D], E>
): FunctionN<[D], AsyncData<E, D>> {
  return a => (predicate(a) ? success(a) : failure(whenFalse(a)));
}

/**
 * HKT asyncData
 *
 * @since 5.0.0
 */
export const asyncData: Monad2<URI> &
  Foldable2<URI> &
  Traversable2<URI> &
  Bifunctor2<URI> &
  Alt2<URI> &
  Extend2<URI> &
  Alternative2<URI> = {
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
  reduceRight,

  // Traversable2v
  traverse,
  sequence,

  // Bifunctor
  bimap,
  mapLeft,

  // Alt
  alt,

  // Alternative
  zero,

  // Extend
  extend,
};

/**
 * combines AsyncData<*, *>[] into AsyncData<*, *[]>
 *
 * @since 5.0.0
 */
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
