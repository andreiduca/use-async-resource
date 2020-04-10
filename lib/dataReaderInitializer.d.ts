import { ApiFn, DataOrModifiedFn } from './types';
export declare function initializeDataReader<ResponseType>(apiFn: ApiFn<ResponseType>): DataOrModifiedFn<ResponseType>;
export declare function initializeDataReader<ResponseType, ArgTypes extends any[]>(apiFn: ApiFn<ResponseType, ArgTypes>, ...parameters: ArgTypes): DataOrModifiedFn<ResponseType>;
