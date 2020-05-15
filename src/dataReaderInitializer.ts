import { ApiFn, DataOrModifiedFn, ModifierFn } from './types';
import { resourceCache } from './cache';

/**
 * Wrapper for an apiFunction without params.
 * It only takes the api function as an argument.
 * It returns a data reader with an optional modifier function.
 *
 * @param apiFn A typical api function that doesn't take any parameters.
 */
export function initializeDataReader<ResponseType>(
  apiFn: ApiFn<ResponseType>,
): DataOrModifiedFn<ResponseType>;

/**
 * Wrapper for an apiFunction with params.
 * It takes the api function and all its expected arguments.
 * Also returns a data reader with an optional modifier function.
 *
 * @param apiFn A typical api function with parameters.
 * @param parameters An arbitrary number of parameters.
 */
export function initializeDataReader<ResponseType, ArgTypes extends any[]>(
  apiFn: ApiFn<ResponseType, ArgTypes>,
  ...parameters: ArgTypes
): DataOrModifiedFn<ResponseType>;

// implementation that covers the above overloads
export function initializeDataReader<ResponseType, ArgTypes extends any[] = []>(
  apiFn: ApiFn<ResponseType, ArgTypes>,
  ...parameters: ArgTypes
) {
  type AsyncStatus = 'init' | 'done' | 'error';

  const apiFnCache = resourceCache(apiFn);
  const cachedResource = apiFnCache.get(...parameters);

  if (cachedResource) {
    return cachedResource;
  }

  let data: ResponseType;
  let status: AsyncStatus = 'init';
  let error: any;

  const fetchingPromise = apiFn(...parameters)
    .then(result => {
      data = result;
      status = 'done';
    })
    .catch(err => {
      error = err;
      status = 'error';
    });

  // the return type successfully satisfies DataOrModifiedFn<ResponseType>
  function dataReaderFn(): ResponseType;
  function dataReaderFn<M>(modifier: ModifierFn<ResponseType, M>): M;
  function dataReaderFn<M>(modifier?: ModifierFn<ResponseType, M>) {
    if (status === 'init') {
      throw fetchingPromise;
    } else if (status === 'error') {
      throw error;
    }

    return typeof modifier === 'function'
      ? (modifier(data) as M)
      : (data as ResponseType);
  }

  apiFnCache.set(dataReaderFn, ...parameters);

  return dataReaderFn;
}
