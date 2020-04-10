import React from 'react';
interface State {
    error?: Error;
    errorMessage?: string;
}
export interface Props<E extends any = Error> {
    errorMessage?: React.ReactComponentElement<any> | string | ((error: E) => string | React.ReactComponentElement<any>);
}
declare class AsyncResourceErrorBoundary<CustomErrorType> extends React.Component<Props<CustomErrorType>, State> {
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    static getDerivedStateFromProps({ errorMessage }: Props, state: State): State | {
        errorMessage: string | React.ReactComponentElement<any, Pick<any, string | number | symbol>>;
    };
    constructor(props: Props<CustomErrorType>);
    render(): {} | null | undefined;
}
export default AsyncResourceErrorBoundary;
