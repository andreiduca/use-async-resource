import { ApiFn, DataOrModifiedFn } from './types';
export declare function resourceCache<R, A extends any[]>(apiFn: ApiFn<R, A>): {
    get(...params: never[] | A): DataOrModifiedFn<R> | undefined;
    set(dataFn: DataOrModifiedFn<R>, ...params: never[] | A): Map<string, DataOrModifiedFn<R>>;
    delete(...params: never[] | A): boolean;
    clear(): void;
};
