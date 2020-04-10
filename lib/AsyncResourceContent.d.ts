import React from 'react';
import { Props as ErrorBoundaryProps } from './AsyncResourceErrorBoundary';
interface AsyncResourceContentProps {
    fallback: React.ReactComponentElement<any> | string;
    errorComponent?: React.ComponentType<any>;
}
declare type Props<T> = AsyncResourceContentProps & ErrorBoundaryProps<T>;
declare const AsyncResourceContent: <T extends any = Error>({ children, fallback, errorMessage, errorComponent: ErrorComponent, }: React.PropsWithChildren<Props<T>>) => JSX.Element;
export default AsyncResourceContent;
