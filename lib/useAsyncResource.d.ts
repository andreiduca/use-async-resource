import { ApiFn, UpdaterFn, DataOrModifiedFn, LazyDataOrModifiedFn } from './types';
export declare function useAsyncResource<ResponseType, ArgTypes extends unknown[]>(apiFunction: ApiFn<ResponseType, ArgTypes>): [LazyDataOrModifiedFn<ResponseType>, UpdaterFn<ArgTypes>];
export declare function useAsyncResource<ResponseType>(apiFunction: ApiFn<ResponseType>, eagerLoading: never[]): [DataOrModifiedFn<ResponseType>, UpdaterFn];
export declare function useAsyncResource<ResponseType, ArgTypes extends unknown[]>(apiFunction: ApiFn<ResponseType, ArgTypes>, ...parameters: ArgTypes): [DataOrModifiedFn<ResponseType>, UpdaterFn<ArgTypes>];
