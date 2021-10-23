/**
 * A typical api function: takes an arbitrary number of arguments of type A
 * and returns a Promise which resolves with a specific response type of R.
 */
export type ApiFn<R, A extends unknown[] = []> = (...args: A) => Promise<R>;

/**
 * An updater function: has a similar signature with the original api function,
 * but doesn't return anything because it only triggers new api calls.
 */
export type UpdaterFn<A extends unknown[] = []> = (...args: A) => void;

/**
 * A simple data reader function: returns the response type R.
 */
type DataFn<R> = () => R;
/**
 * A lazy data reader function: can return the response type R or `undefined`.
 */
type LazyDataFn<R> = () => R | undefined;

/**
 * A modifier function which takes as only argument the response type R and returns a different type M.
 */
export type ModifierFn<R, M = unknown> = (response: R) => M;

/**
 * A data reader with a modifier function,
 * returning the modified type M instead of the response type R.
 */
type ModifiedDataFn<R> = <M>(modifier: ModifierFn<R, M>) => M;
/**
 * A lazy data reader with a modifier function,
 * returning the modified type M instead of the response type R, or `undefined`.
 */
type LazyModifiedDataFn<R> = <M>(modifier: ModifierFn<R, M>) => M | undefined;

// Finally, our actual eager and lazy implementations will use both versions (with and without a modifier function),
// so we need overloaded types that will satisfy them simultaneously

/**
 * A data reader function with an optional modifier function.
 */
export type DataOrModifiedFn<R> = DataFn<R> & ModifiedDataFn<R>;
/**
 * A lazy data reader function with an optional modifier function.
 */
export type LazyDataOrModifiedFn<R> = LazyDataFn<R> & LazyModifiedDataFn<R>;
