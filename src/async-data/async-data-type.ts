import { Either, left, right } from 'fp-ts/lib/Either';
import { Function1, Function2, identity, Lazy, Predicate, toString, Curried2 } from 'fp-ts/lib/function';
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

export type AsyncData<E, D> = AsyncPending<E, D> | AsyncSuccess<E, D> | AsyncFailure<E, D>;

/**
 * AsyncPending
 * Encapsulates first request and refresh data
 *
 * Ideas:
 * Extend to also option error
 */
export class AsyncPending<E, D> {
  readonly _tag: 'AsyncPending' = 'AsyncPending';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  constructor(readonly option: Option<D> = none) {}

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
  fold<B>(onPending: Function1<Option<D>, B>, __: Function1<E, B>, ___: Function1<D, B>): B {
    return onPending(this.option);
  }

  // Ap
  ap<B>(fab: AsyncData<E, Function1<D, B>>): AsyncData<E, B> {
    return fab.fold(
      opt => new AsyncPending<E, B>(this.option.ap(opt)) as AsyncData<E, B>,
      err => new AsyncFailure<E, B>(err),
      val => new AsyncPending(this.option.map(val))
    );
  }

  // Chain
  chain<B>(f: Function1<D, AsyncData<E, B>>): AsyncData<E, B> {
    return this.option.isSome() ? f(this.option.value) : new AsyncPending<E, B>(none);
  }

  // Maps
  map<B>(f: Function1<D, B>): AsyncData<E, B> {
    return new AsyncPending(this.option.map(f));
  }
  mapLeft<M>(_: Function1<E, M>): AsyncData<M, D> {
    return (this as unknown) as AsyncPending<M, D>;
  }
  bimap<V, B>(_: (e: E) => V, g: (d: D) => B): AsyncData<V, B> {
    return new AsyncPending(this.option.map(g));
  }

  // Reduce
  reduce<B>(b: B, f: Function2<B, D, B>): B {
    return this.option.reduce(b, f);
  }

  // Extend
  extend<B>(f: Function1<AsyncData<E, D>, B>): AsyncData<E, B> {
    return this.option.isSome() ? new AsyncPending(some(f(this))) : ((this as unknown) as AsyncPending<E, B>);
  }

  // GetOrElseL
  getOrElse(value: D): D {
    return this.option.isSome() ? this.option.value : value;
  }
  getOrElseL(f: Lazy<D>): D {
    return this.option.isSome() ? this.option.value : f();
  }

  // To
  toOption(): Option<D> {
    return this.option;
  }
  toEither(err: E): Either<E, D> {
    return this.option.isSome() ? right(this.option.value) : left(err);
  }
  toEitherL(err: Lazy<E>): Either<E, D> {
    return this.option.isSome() ? right(this.option.value) : left(err());
  }
  toNullable(): D | null {
    return this.option.toNullable();
  }
  toString(): string {
    return `asyncPending(${this.option.toString()})`;
  }

  // Utility
  contains(S: Setoid<D>, d: D): boolean {
    return this.option.contains(S, d);
  }
  exists(p: Predicate<D>): boolean {
    return this.option.exists(p);
  }
  recover(_: (error: E) => Option<D>): AsyncData<E, D> {
    return this;
  }
  recoverMap<B>(_: (error: E) => Option<B>, g: (value: D) => B): AsyncData<E, B> {
    return this.map(g);
  }

  // React pending helper
  to<B>(onPending: B, onFailure: Function1<E, B>, onSuccess: Curried2<boolean, D, B>): B {
    return this.option.fold(onPending, onSuccess(true));
  }
}

/**
 * Async Failure
 *
 * Ideas:
 * Extend failure to optionally contain previous value
 */
export class AsyncFailure<E, D> {
  readonly _tag: 'AsyncFailure' = 'AsyncFailure';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  constructor(readonly error: E) {}

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
  fold<B>(_: Function1<Option<D>, B>, onFailure: Function1<E, B>, ___: Function1<D, B>): B {
    return onFailure(this.error);
  }

  // Ap
  ap<B>(fab: AsyncData<E, Function1<D, B>>): AsyncData<E, B> {
    return fab.fold(
      _ => new AsyncFailure(this.error) as AsyncData<E, B>,
      err => new AsyncFailure(err),
      __ => new AsyncFailure(this.error)
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
    return new AsyncFailure(f(this.error));
  }
  bimap<V, B>(f: (e: E) => V, _: (d: D) => B): AsyncData<V, B> {
    return new AsyncFailure(f(this.error));
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
  recover(f: (error: E) => Option<D>): AsyncData<E, D> {
    return this.recoverMap(f, identity);
  }
  recoverMap<B>(f: (error: E) => Option<B>, _: (value: D) => B): AsyncData<E, B> {
    return f(this.error).fold((this as unknown) as AsyncData<E, B>, b => new AsyncSuccess(b));
  }

  // React pending helper
  to<B>(onPending: B, onFailure: Function1<E, B>, onSuccess: Curried2<boolean, D, B>): B {
    return onFailure(this.error);
  }
}

export class AsyncSuccess<E, D> {
  readonly _tag: 'AsyncSuccess' = 'AsyncSuccess';
  readonly _URI!: URI;
  readonly _E!: E;
  readonly _D!: D;

  constructor(readonly value: D) {}

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
  fold<B>(_: Function1<Option<D>, B>, __: Function1<E, B>, onSuccess: Function1<D, B>): B {
    return onSuccess(this.value);
  }

  // Ap
  ap<B>(fab: AsyncData<E, Function1<D, B>>): AsyncData<E, B> {
    return fab.fold(
      opt => new AsyncPending<E, B>(opt.map(f => f(this.value))) as AsyncData<E, B>,
      err => new AsyncFailure<E, B>(err),
      val => new AsyncSuccess<E, B>(val(this.value))
    );
  }

  // Chain
  chain<B>(f: Function1<D, AsyncData<E, B>>): AsyncData<E, B> {
    return f(this.value);
  }

  // Maps
  map<B>(f: Function1<D, B>): AsyncData<E, B> {
    return new AsyncSuccess(f(this.value));
  }
  mapLeft<M>(_: Function1<E, M>): AsyncData<M, D> {
    return (this as unknown) as AsyncSuccess<M, D>;
  }
  bimap<V, B>(_: (e: E) => V, g: (d: D) => B): AsyncData<V, B> {
    return new AsyncSuccess(g(this.value));
  }

  // Reduce
  reduce<B>(b: B, f: Function2<B, D, B>): B {
    return f(b, this.value);
  }

  // Extend
  extend<B>(f: Function1<AsyncData<E, D>, B>): AsyncData<E, B> {
    return new AsyncSuccess(f(this));
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
  recover(_: (error: E) => Option<D>): AsyncData<E, D> {
    return (this as unknown) as AsyncSuccess<E, D>;
  }
  recoverMap<B>(_: (error: E) => Option<B>, f: (value: D) => B): AsyncData<E, B> {
    return this.map(f);
  }

  // React pending helper
  to<B>(onPending: B, onFailure: Function1<E, B>, onSuccess: Curried2<boolean, D, B>): B {
    return onSuccess(false)(this.value);
  }
}
