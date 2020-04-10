import { useCallback, useState } from 'react';

import {
  ApiFn,
  UpdaterFn,
  DataOrModifiedFn,
  LazyDataOrModifiedFn,
} from './types';
import { initializeDataReader } from './dataReaderInitializer';

/**
 * Lazy initializer.
 * The only param passed is the api function that will be wrapped.
 * The returned data reader LazyDataOrModifiedFn<ResponseType> is "lazy",
 *   meaning it can return `undefined` if the api call hasn't started.
 * The returned updater function UpdaterFn<ArgTypes>
 *   can take any number of arguments, just like the wrapped api function
 *
 * @param apiFunction A typical api function.
 */
export function useAsyncResource<ResponseType, ArgTypes extends any[]>(
  apiFunction: ApiFn<ResponseType, ArgTypes>,
): [LazyDataOrModifiedFn<ResponseType>, UpdaterFn<ArgTypes>];

/**
 * Eager initializer for an api function without params.
 * The second param must be `[]` to indicate we want to start the api call immediately.
 * The returned data reader DataOrModifiedFn<ResponseType> is "eager",
 *   meaning it will always return the ResponseType
 *   (or a modified version of it, if requested).
 * The returned updater function doesn't take any arguments,
 *   just like the wrapped api function
 *
 * @param apiFunction A typical api function that doesn't take any parameters.
 * @param eagerLoading If present, the api function will get executed immediately.
 */
export function useAsyncResource<ResponseType>(
  apiFunction: ApiFn<ResponseType>,
  eagerLoading: never[], // the type of an empty array `[]` is `never[]`
): [DataOrModifiedFn<ResponseType>, UpdaterFn];

/**
 * Eager initializer for an api function with params.
 * The returned data reader is "eager", meaning it will return the ResponseType
 *   (or a modified version of it, if requested).
 * The returned updater function can take any number of arguments,
 *   just like the wrapped api function
 *
 * @param apiFunction A typical api function with an arbitrary number of parameters.
 * @param parameters If present, the api function will get executed immediately with these parameters.
 */
export function useAsyncResource<ResponseType, ArgTypes extends any[]>(
  apiFunction: ApiFn<ResponseType, ArgTypes>,
  ...parameters: ArgTypes
): [DataOrModifiedFn<ResponseType>, UpdaterFn<ArgTypes>];

// implementation that covers the above overloads
export function useAsyncResource<ResponseType, ArgTypes extends any[]>(
  apiFunction: ApiFn<ResponseType> | ApiFn<ResponseType, ArgTypes>,
  ...parameters: ArgTypes
) {
  // initialize the data reader
  const [dataReader, updateDataReader] = useState(() => {
    // lazy initialization, when no parameters are passed
    if (!parameters.length) {
      // we return an empty data reader function
      return (() => undefined) as LazyDataOrModifiedFn<ResponseType>;
    }

    // eager initialization for api functions that don't accept arguments
    if (
      // check that the api function doesn't take any arguments
      !apiFunction.length &&
      // but the user passed an empty array as the only parameter
      parameters.length === 1 &&
      Array.isArray(parameters[0]) &&
      parameters[0].length === 0
    ) {
      return initializeDataReader(apiFunction as ApiFn<ResponseType>);
    }

    // eager initialization for all other cases
    return initializeDataReader(
      apiFunction as ApiFn<ResponseType, ArgTypes>,
      ...parameters,
    );
  });

  // the updater function
  const updater = useCallback(
    (...newParameters: ArgTypes) => {
      updateDataReader(() =>
        initializeDataReader(
          apiFunction as ApiFn<ResponseType, ArgTypes>,
          ...newParameters,
        ),
      );
    },
    [apiFunction],
  );

  return [dataReader, updater];
}
