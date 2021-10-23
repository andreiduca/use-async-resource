import { useCallback, useMemo, useRef, useState } from 'react';

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
export function useAsyncResource<ResponseType, ArgTypes extends unknown[]>(
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
export function useAsyncResource<ResponseType, ArgTypes extends unknown[]>(
  apiFunction: ApiFn<ResponseType, ArgTypes>,
  ...parameters: ArgTypes
): [DataOrModifiedFn<ResponseType>, UpdaterFn<ArgTypes>];

// implementation that covers the above overloads
export function useAsyncResource<ResponseType, ArgTypes extends unknown[]>(
  apiFunction: ApiFn<ResponseType> | ApiFn<ResponseType, ArgTypes>,
  ...parameters: ArgTypes
) {
  // keep the data reader inside a mutable object ref
  // always initialize with a lazy data reader, as it can be overwritten by the useMemo immediately
  const dataReaderObj = useRef<DataOrModifiedFn<ResponseType> | LazyDataOrModifiedFn<ResponseType>>(() => undefined);

  // like useEffect, but runs immediately
  useMemo(() => {
    if (parameters.length) {
      // eager initialization for api functions that don't accept arguments
      if (
        // check that the api function doesn't take any arguments
        !apiFunction.length &&
        // but the user passed an empty array as the only parameter
        parameters.length === 1 &&
        Array.isArray(parameters[0]) &&
        parameters[0].length === 0
      ) {
        dataReaderObj.current = initializeDataReader(apiFunction as ApiFn<ResponseType>);
      } else {
        // eager initialization for all other cases
        dataReaderObj.current = initializeDataReader(
          apiFunction as ApiFn<ResponseType, ArgTypes>,
          ...parameters,
        );
      }
    }
  }, [apiFunction, ...parameters]);

  // state to force re-render
  const [, forceRender] = useState(0);

  const updaterFn = useCallback((...newParameters: ArgTypes) => {
    // update the object ref
    dataReaderObj.current = initializeDataReader(apiFunction as ApiFn<ResponseType, ArgTypes>, ...newParameters);
    // update state to force a re-render
    forceRender(ct => 1 - ct);
  }, [apiFunction]);

  return [dataReaderObj.current, updaterFn];
}
