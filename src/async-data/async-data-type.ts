import { Either, left, right } from 'fp-ts/lib/Either';
import { FunctionN, Lazy, Predicate } from 'fp-ts/lib/function';
import { none, Option, some } from 'fp-ts/lib/Option';

// HKT/URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    AsyncData: AsyncData<E, A>;
  }
}

/**
 * URI const for AsyncData
 *
 * @since 5.0.0
 */
export const URI = 'AsyncData';

/**
 * URI type for AsyncData
 *
 * @since 5.0.0
 */
export type URI = typeof URI;

/**
 * AsyncData<E, D> sum type
 *
 * @since 5.0.0
 */
export type AsyncData<E, D> =
  | AsyncInitial<E, D>
  | AsyncPending<E, D>
  | AsyncSuccess<E, D>
  | AsyncFailure<E, D>;

/**
 * AsyncInitial
 * Encapsulates initial state prior to loading
 *
 * @since 5.0.0
 */
export class AsyncInitial<E, D> {
  readonly _tag: 'AsyncInitial' = 'AsyncInitial';
  readonly _URI!: URI;
  readonly refreshing = false;

  constructor() {}

  /**
   * @since 5.0.0
   */
  isInitial(): this is AsyncInitial<E, D> {
    return true;
  }
  /**
   * @since 5.0.0
   */
  isPending(): this is AsyncPending<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isFailure(): this is AsyncFailure<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isSuccess(): this is AsyncSuccess<E, D> {
    return false;
  }

  /**
   * @since 5.0.0
   */
  alt(fy: AsyncData<E, D>): AsyncData<E, D> {
    return fy;
  }
  /**
   * @since 5.0.0
   */
  altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> {
    return fy();
  }

  /**
   * @since 5.0.0
   */
  fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B {
    return onInitial;
  }

  /**
   * @since 5.0.0
   */
  ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }

  /**
   * @since 5.0.0
   */
  chain<B>(f: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }

  /**
   * @since 5.0.0
   */
  map<B>(f: FunctionN<[D], B>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }
  /**
   * @since 5.0.0
   */
  mapLeft<M>(_: FunctionN<[E], M>): AsyncData<M, D> {
    return (this as unknown) as AsyncData<M, D>;
  }
  /**
   * @since 5.0.0
   */
  bimap<V, B>(_: FunctionN<[E], V>, __: FunctionN<[D], B>): AsyncData<V, B> {
    return (this as unknown) as AsyncData<V, B>;
  }

  /**
   * @since 5.0.0
   */
  reduce<B>(b: B, _: FunctionN<[B, D], B>): B {
    return b;
  }

  /**
   * @since 5.0.0
   */
  extend<B>(f: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }

  /**
   * @since 5.0.0
   */
  getOrElse(value: D): D {
    return value;
  }
  /**
   * @since 5.0.0
   */
  getOrElseL(f: Lazy<D>): D {
    return f();
  }

  /**
   * @since 5.0.0
   */
  toOption(): Option<D> {
    return none;
  }
  /**
   * @since 5.0.0
   */
  toEither(err: E): Either<E, D> {
    return left(err);
  }
  /**
   * @since 5.0.0
   */
  toEitherL(err: Lazy<E>): Either<E, D> {
    return left(err());
  }
  /**
   * @since 5.0.0
   */
  toNullable(): D | null {
    return null;
  }
  /**
   * @since 5.0.0
   */
  toString(): string {
    return `asyncInitial()`;
  }

  /**
   * @since 5.0.0
   */
  exists(_: Predicate<D>): boolean {
    return false;
  }
}

/**
 * AsyncPending
 * Encapsulates loading state with no data
 *
 * @since 5.0.0
 */
export class AsyncPending<E, D> {
  readonly _tag: 'AsyncPending' = 'AsyncPending';
  readonly _URI!: URI;

  readonly refreshing = true;

  constructor() {}

  /**
   * @since 5.0.0
   */
  isInitial(): this is AsyncInitial<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isPending(): this is AsyncPending<E, D> {
    return true;
  }
  /**
   * @since 5.0.0
   */
  isFailure(): this is AsyncFailure<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isSuccess(): this is AsyncSuccess<E, D> {
    return false;
  }

  /**
   * @since 5.0.0
   */
  alt(fy: AsyncData<E, D>): AsyncData<E, D> {
    return fy;
  }
  /**
   * @since 5.0.0
   */
  altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> {
    return fy();
  }

  /**
   * @since 5.0.0
   */
  fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B {
    return onPending;
  }

  /**
   * @since 5.0.0
   */
  ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> {
    return (this as unknown) as AsyncPending<E, B>;
  }

  /**
   * @since 5.0.0
   */
  chain<B>(f: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }

  /**
   * @since 5.0.0
   */
  map<B>(f: FunctionN<[D], B>): AsyncData<E, B> {
    return (this as unknown) as AsyncData<E, B>;
  }
  /**
   * @since 5.0.0
   */
  mapLeft<M>(_: FunctionN<[E], M>): AsyncData<M, D> {
    return (this as unknown) as AsyncPending<M, D>;
  }
  /**
   * @since 5.0.0
   */
  bimap<V, B>(_: FunctionN<[E], V>, __: FunctionN<[D], B>): AsyncData<V, B> {
    return (this as unknown) as AsyncData<V, B>;
  }

  /**
   * @since 5.0.0
   */
  reduce<B>(b: B, _: FunctionN<[B, D], B>): B {
    return b;
  }

  /**
   * @since 5.0.0
   */
  extend<B>(f: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> {
    return (this as unknown) as AsyncPending<E, B>;
  }

  /**
   * @since 5.0.0
   */
  getOrElse(value: D): D {
    return value;
  }
  /**
   * @since 5.0.0
   */
  getOrElseL(f: Lazy<D>): D {
    return f();
  }

  /**
   * @since 5.0.0
   */
  toOption(): Option<D> {
    return none;
  }
  /**
   * @since 5.0.0
   */
  toEither(err: E): Either<E, D> {
    return left(err);
  }
  /**
   * @since 5.0.0
   */
  toEitherL(err: Lazy<E>): Either<E, D> {
    return left(err());
  }
  /**
   * @since 5.0.0
   */
  toNullable(): D | null {
    return null;
  }
  /**
   * @since 5.0.0
   */
  toString(): string {
    return `asyncPending()`;
  }

  /**
   * @since 5.0.0
   */
  exists(_: Predicate<D>): boolean {
    return false;
  }
}

/**
 * Async Failure
 * Encapsulates pure error state when there was no previous result
 *
 * @since 5.0.0
 */
export class AsyncFailure<E, D> {
  readonly _tag: 'AsyncFailure' = 'AsyncFailure';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  constructor(readonly error: E, readonly refreshing = false) {}

  /**
   * @since 5.0.0
   */
  isInitial(): this is AsyncInitial<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isPending(): this is AsyncPending<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isFailure(): this is AsyncFailure<E, D> {
    return true;
  }
  /**
   * @since 5.0.0
   */
  isSuccess(): this is AsyncSuccess<E, D> {
    return false;
  }

  /**
   * @since 5.0.0
   */
  alt(fy: AsyncData<E, D>): AsyncData<E, D> {
    return fy;
  }
  /**
   * @since 5.0.0
   */
  altL(fy: Lazy<AsyncData<E, D>>): AsyncData<E, D> {
    return fy();
  }

  /**
   * @since 5.0.0
   */
  fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B {
    return onFailure(this.error, this.refreshing);
  }

  /**
   * @since 5.0.0
   */
  ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> {
    return new AsyncFailure(this.error, this.refreshing || fab.refreshing);
  }

  /**
   * @since 5.0.0
   */
  chain<B>(_: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> {
    return (this as unknown) as AsyncFailure<E, B>;
  }

  /**
   * @since 5.0.0
   */
  map<B>(_: FunctionN<[D], B>): AsyncData<E, B> {
    return (this as unknown) as AsyncFailure<E, B>;
  }
  /**
   * @since 5.0.0
   */
  mapLeft<M>(f: FunctionN<[E], M>): AsyncData<M, D> {
    return new AsyncFailure(f(this.error), this.refreshing);
  }
  /**
   * @since 5.0.0
   */
  bimap<V, B>(f: FunctionN<[E], V>, _: FunctionN<[D], B>): AsyncData<V, B> {
    return new AsyncFailure(f(this.error), this.refreshing);
  }

  /**
   * @since 5.0.0
   */
  reduce<B>(b: B, _: FunctionN<[B, D], B>): B {
    return b;
  }

  /**
   * @since 5.0.0
   */
  extend<B>(_: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> {
    return (this as unknown) as AsyncFailure<E, B>;
  }

  /**
   * @since 5.0.0
   */
  getOrElse(value: D): D {
    return value;
  }
  /**
   * @since 5.0.0
   */
  getOrElseL(f: Lazy<D>): D {
    return f();
  }

  /**
   * @since 5.0.0
   */
  toOption(): Option<D> {
    return none;
  }
  /**
   * @since 5.0.0
   */
  toEither(_: E): Either<E, D> {
    return left(this.error);
  }
  /**
   * @since 5.0.0
   */
  toEitherL(_: Lazy<E>): Either<E, D> {
    return left(this.error);
  }
  /**
   * @since 5.0.0
   */
  toNullable(): D | null {
    return null;
  }
  /**
   * @since 5.0.0
   */
  toString(): string {
    return `asyncFailure()`;
  }

  /**
   * @since 5.0.0
   */
  exists(_: Predicate<D>): boolean {
    return false;
  }
}

/**
 * AsyncSuccess
 * Encapsulates the only state that has result data
 *
 * @since 5.0.0
 */
export class AsyncSuccess<E, D> {
  readonly _tag: 'AsyncSuccess' = 'AsyncSuccess';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  constructor(readonly value: D, readonly refreshing = false) {}

  /**
   * @since 5.0.0
   */
  isInitial(): this is AsyncInitial<E, D> {
    return false;
  }

  /**
   * @since 5.0.0
   */
  isPending(): this is AsyncPending<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isFailure(): this is AsyncFailure<E, D> {
    return false;
  }
  /**
   * @since 5.0.0
   */
  isSuccess(): this is AsyncSuccess<E, D> {
    return true;
  }

  /**
   * @since 5.0.0
   */
  alt(_: AsyncData<E, D>): AsyncData<E, D> {
    return this;
  }
  /**
   * @since 5.0.0
   */
  altL(_: Lazy<AsyncData<E, D>>): AsyncData<E, D> {
    return this;
  }
  /**
   * @since 5.0.0
   */
  fold<B>(
    onInitial: B,
    onPending: B,
    onFailure: FunctionN<[E, boolean], B>,
    onSuccess: FunctionN<[D, boolean], B>
  ): B {
    return onSuccess(this.value, this.refreshing);
  }

  /**
   * @since 5.0.0
   */
  ap<B>(fab: AsyncData<E, FunctionN<[D], B>>): AsyncData<E, B> {
    return fab.fold(
      new AsyncInitial<E, B>() as AsyncData<E, B>,
      new AsyncPending<E, B>() as AsyncData<E, B>,
      (e, r) => new AsyncFailure<E, B>(e, this.refreshing || r),
      (f, r) => new AsyncSuccess(f(this.value), this.refreshing || r)
    );
  }

  /**
   * @since 5.0.0
   */
  chain<B>(f: FunctionN<[D], AsyncData<E, B>>): AsyncData<E, B> {
    return f(this.value);
  }

  /**
   * @since 5.0.0
   */
  map<B>(f: FunctionN<[D], B>): AsyncData<E, B> {
    return new AsyncSuccess(f(this.value), this.refreshing);
  }
  /**
   * @since 5.0.0
   */
  mapLeft<M>(_: FunctionN<[E], M>): AsyncData<M, D> {
    return (this as unknown) as AsyncSuccess<M, D>;
  }
  /**
   * @since 5.0.0
   */
  bimap<V, B>(_: (e: E) => V, g: (d: D) => B): AsyncData<V, B> {
    return new AsyncSuccess(g(this.value), this.refreshing);
  }

  /**
   * @since 5.0.0
   */
  reduce<B>(b: B, f: FunctionN<[B, D], B>): B {
    return f(b, this.value);
  }

  /**
   * @since 5.0.0
   */
  extend<B>(f: FunctionN<[AsyncData<E, D>], B>): AsyncData<E, B> {
    return new AsyncSuccess(f(this), this.refreshing);
  }

  /**
   * @since 5.0.0
   */
  getOrElse(_: D): D {
    return this.value;
  }
  /**
   * @since 5.0.0
   */
  getOrElseL(_: Lazy<D>): D {
    return this.value;
  }

  /**
   * @since 5.0.0
   */
  toOption(): Option<D> {
    return some(this.value);
  }
  /**
   * @since 5.0.0
   */
  toEither(_: E): Either<E, D> {
    return right(this.value);
  }
  /**
   * @since 5.0.0
   */
  toEitherL(_: Lazy<E>): Either<E, D> {
    return right(this.value);
  }
  /**
   * @since 5.0.0
   */
  toNullable(): D | null {
    return this.value;
  }
  /**
   * @since 5.0.0
   */
  toString(): string {
    return `asyncSuccess()`;
  }

  /**
   * @since 5.0.0
   */
  exists(f: Predicate<D>): boolean {
    return f(this.value);
  }
}
