import { ApiFn, DataOrModifiedFn } from './types';
export declare function resourceCache<R, A extends unknown[]>(apiFn: ApiFn<R, A>): {
    get(...params: A | never[]): DataOrModifiedFn<R> | undefined;
    set(dataFn: DataOrModifiedFn<R>, ...params: A | never[]): Map<string, DataOrModifiedFn<R>>;
    delete(...params: A | never[]): boolean;
    clear(): void;
};
