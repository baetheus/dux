import { Either, left, right } from 'fp-ts/lib/Either';
import { Function1, Function2, Lazy, Predicate, toString } from 'fp-ts/lib/function';
import { none, Option, some } from 'fp-ts/lib/Option';
import { Setoid } from 'fp-ts/lib/Setoid';

// HKT/URI

declare module 'fp-ts/lib/HKT' {
  interface URI2HKT2<L, A> {
    AsyncData: AsyncData<L, A>;
  }
}
export const URI = 'AsyncData';
export type URI = typeof URI;

export type AsyncData<E, D> =
  | AsyncPending<E, D>
  | AsyncSuccess<E, D>
  | AsyncFailure<E, D>;

/**
 * AsyncPending
 * Encapsulates loading state with no data
 */
export class AsyncPending<E, D> {
  readonly _tag: 'AsyncPending' = 'AsyncPending';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  readonly refreshing = true;

  constructor() {}

  // Is
  isPending(): this is AsyncPending<E, D> {
    return true;
  }
  isFailure(): this is AsyncFailure<E, D> {
    return false;
  }
  isSuccess(): this is AsyncSuccess<E, D> {
    return false;
  }

  // Alt
  alt(fy: AsyncData<E, D>): AsyncData<E, D> {
    return fy;
  }
  altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> {
    return fy();
  }

  // Fold
  fold<B>(
    onPending: B,
    onFailure: Function2<E, boolean, B>,
    onSuccess: Function2<D, boolean, B>
  ): B {
    return onPending;
  }

  // Ap
  ap<B>(fab: AsyncData<E, Function1<D, B>>): AsyncData<E, B> {
    return fab.fold(
      new AsyncPending(),
      () => new AsyncPending(),
      () => new AsyncPending()
    );
  }

  // Chain
  chain<B>(f: Function1<D, AsyncData<E, B>>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }

  // Maps
  map<B>(f: Function1<D, B>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }
  mapLeft<M>(_: Function1<E, M>): AsyncData<M, D> {
    return (this as unknown) as AsyncPending<M, D>;
  }
  bimap<V, B>(_: (e: E) => V, __: (d: D) => B): AsyncData<V, B> {
    return (this as unknown) as AsyncData<V, B>;
  }

  // Reduce
  reduce<B>(b: B, _: Function2<B, D, B>): B {
    return b;
  }

  // Extend
  extend<B>(f: Function1<AsyncData<E, D>, B>): AsyncData<E, B> {
    return (this as unknown) as AsyncPending<E, B>;
  }

  // GetOrElseL
  getOrElse(value: D): D {
    return value;
  }
  getOrElseL(f: Lazy<D>): D {
    return f();
  }

  // To
  toOption(): Option<D> {
    return none;
  }
  toEither(err: E): Either<E, D> {
    return left(err);
  }
  toEitherL(err: Lazy<E>): Either<E, D> {
    return left(err());
  }
  toNullable(): D | null {
    return null;
  }
  toString(): string {
    return `asyncPending()`;
  }

  // Utility
  contains(_: Setoid<D>, __: D): boolean {
    return false;
  }
  exists(_: Predicate<D>): boolean {
    return false;
  }
}

/**
 * Async Failure
 * Encapsulates pure error state when there was no previous result
 */
export class AsyncFailure<E, D> {
  readonly _tag: 'AsyncFailure' = 'AsyncFailure';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  constructor(readonly error: E, readonly refreshing = false) {}

  // Is
  isPending(): this is AsyncPending<E, D> {
    return false;
  }
  isFailure(): this is AsyncFailure<E, D> {
    return true;
  }
  isSuccess(): this is AsyncSuccess<E, D> {
    return false;
  }

  // Alt
  alt(fy: AsyncData<E, D>): AsyncData<E, D> {
    return fy;
  }
  altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> {
    return fy();
  }

  // Fold
  fold<B>(
    onPending: B,
    onFailure: Function2<E, boolean, B>,
    onSuccess: Function2<D, boolean, B>
  ): B {
    return onFailure(this.error, this.refreshing);
  }

  // Ap
  ap<B>(fab: AsyncData<E, Function1<D, B>>): AsyncData<E, B> {
    return fab.fold(
      new AsyncFailure(this.error, true),
      (e, r) => new AsyncFailure(e, this.refreshing || r),
      (f, r) => new AsyncFailure(this.error, this.refreshing || r)
    );
  }

  // Chain
  chain<B>(_: Function1<D, AsyncData<E, B>>): AsyncData<E, B> {
    return (this as unknown) as AsyncFailure<E, B>;
  }

  // Maps
  map<B>(_: Function1<D, B>): AsyncData<E, B> {
    return (this as unknown) as AsyncFailure<E, B>;
  }
  mapLeft<M>(f: Function1<E, M>): AsyncData<M, D> {
    return new AsyncFailure(f(this.error), this.refreshing);
  }
  bimap<V, B>(f: (e: E) => V, _: (d: D) => B): AsyncData<V, B> {
    return new AsyncFailure(f(this.error), this.refreshing);
  }

  // Reduce
  reduce<B>(b: B, _: Function2<B, D, B>): B {
    return b;
  }

  // Extend
  extend<B>(_: Function1<AsyncData<E, D>, B>): AsyncData<E, B> {
    return (this as unknown) as AsyncFailure<E, B>;
  }

  // GetOrElseL
  getOrElse(value: D): D {
    return value;
  }
  getOrElseL(f: Lazy<D>): D {
    return f();
  }

  // To
  toOption(): Option<D> {
    return none;
  }
  toEither(_: E): Either<E, D> {
    return left(this.error);
  }
  toEitherL(_: Lazy<E>): Either<E, D> {
    return left(this.error);
  }
  toNullable(): D | null {
    return null;
  }
  toString(): string {
    return `asyncFailure(${toString(this.error)})`;
  }

  // Utility
  contains(_: Setoid<D>, __: D): boolean {
    return false;
  }
  exists(_: Predicate<D>): boolean {
    return false;
  }
}

/**
 * AsyncSuccess
 * Encapsulates the only state that has result data
 *
 */
export class AsyncSuccess<E, D> {
  readonly _tag: 'AsyncSuccess' = 'AsyncSuccess';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  constructor(readonly value: D, readonly refreshing = false) {}

  // Is
  isPending(): this is AsyncPending<E, D> {
    return false;
  }
  isFailure(): this is AsyncFailure<E, D> {
    return false;
  }
  isSuccess(): this is AsyncSuccess<E, D> {
    return true;
  }

  // Alt
  alt(_: AsyncData<E, D>): AsyncData<E, D> {
    return this;
  }
  altL(_: Lazy<AsyncData<E, D>>): AsyncData<E, D> {
    return this;
  }

  // Fold
  fold<B>(
    onPending: B,
    onFailure: Function2<E, boolean, B>,
    onSuccess: Function2<D, boolean, B>
  ): B {
    return onSuccess(this.value, this.refreshing);
  }

  // Ap
  ap<B>(fab: AsyncData<E, Function1<D, B>>): AsyncData<E, B> {
    return fab.fold(
      new AsyncPending<E, B>() as AsyncData<E, B>,
      (e, r) => new AsyncFailure<E, B>(e, this.refreshing || r),
      (f, r) => new AsyncSuccess(f(this.value), this.refreshing || r)
    );
  }

  // Chain
  chain<B>(f: Function1<D, AsyncData<E, B>>): AsyncData<E, B> {
    return f(this.value);
  }

  // Maps
  map<B>(f: Function1<D, B>): AsyncData<E, B> {
    return new AsyncSuccess(f(this.value), this.refreshing);
  }
  mapLeft<M>(_: Function1<E, M>): AsyncData<M, D> {
    return (this as unknown) as AsyncSuccess<M, D>;
  }
  bimap<V, B>(_: (e: E) => V, g: (d: D) => B): AsyncData<V, B> {
    return new AsyncSuccess(g(this.value), this.refreshing);
  }

  // Reduce
  reduce<B>(b: B, f: Function2<B, D, B>): B {
    return f(b, this.value);
  }

  // Extend
  extend<B>(f: Function1<AsyncData<E, D>, B>): AsyncData<E, B> {
    return new AsyncSuccess(f(this), this.refreshing);
  }

  // GetOrElseL
  getOrElse(_: D): D {
    return this.value;
  }
  getOrElseL(_: Lazy<D>): D {
    return this.value;
  }

  // To
  toOption(): Option<D> {
    return some(this.value);
  }
  toEither(_: E): Either<E, D> {
    return right(this.value);
  }
  toEitherL(_: Lazy<E>): Either<E, D> {
    return right(this.value);
  }
  toNullable(): D | null {
    return this.value;
  }
  toString(): string {
    return `asyncSuccess(${toString(this.value)})`;
  }

  // Utility
  contains(S: Setoid<D>, d: D): boolean {
    return S.equals(this.value, d);
  }
  exists(f: Predicate<D>): boolean {
    return f(this.value);
  }
}
