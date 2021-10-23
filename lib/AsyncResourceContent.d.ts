import * as React from 'react';
import { Props as ErrorBoundaryProps } from './AsyncResourceErrorBoundary';
interface AsyncResourceContentProps {
    fallback: NonNullable<React.ReactNode> | null;
    errorComponent?: React.ComponentType<unknown>;
}
declare type Props<T> = AsyncResourceContentProps & ErrorBoundaryProps<T>;
declare const AsyncResourceContent: <T extends unknown = Error>({ children, fallback, errorMessage, errorComponent: ErrorComponent, }: React.PropsWithChildren<Props<T>>) => JSX.Element;
export default AsyncResourceContent;
