import { ApiFn, DataOrModifiedFn } from './types';
export declare function resourceCache<R, A extends any[]>(apiFn: ApiFn<R, A>, ...params: A | never[]): {
    get(): DataOrModifiedFn<R> | undefined;
    set(data: DataOrModifiedFn<R>): Map<string, DataOrModifiedFn<R>>;
    delete(): boolean;
    clear(): void;
};
