import React, { ReactNode } from 'react';
import { Props as ErrorBoundaryProps } from './AsyncResourceErrorBoundary';
interface AsyncResourceContentProps {
    fallback: NonNullable<ReactNode> | null;
    errorComponent?: React.ComponentType<any>;
}
declare type Props<T> = AsyncResourceContentProps & ErrorBoundaryProps<T>;
declare const AsyncResourceContent: <T extends any = Error>({ children, fallback, errorMessage, errorComponent: ErrorComponent, }: React.PropsWithChildren<Props<T>>) => JSX.Element;
export default AsyncResourceContent;
