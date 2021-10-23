import * as React from 'react';
import AsyncResourceErrorBoundary, { Props as ErrorBoundaryProps } from './AsyncResourceErrorBoundary';

interface AsyncResourceContentProps {
  fallback: NonNullable<React.ReactNode> | null;
  errorComponent?: React.ComponentType<unknown>;
}

type Props<T> = AsyncResourceContentProps & ErrorBoundaryProps<T>;

const AsyncResourceContent = <T extends unknown = Error>({
  children,
  fallback,
  errorMessage,
  errorComponent: ErrorComponent,
}: React.PropsWithChildren<Props<T>>) => {
  const ErrorBoundary = ErrorComponent || AsyncResourceErrorBoundary;

  return (
    <ErrorBoundary errorMessage={errorMessage}>
      <React.Suspense fallback={fallback}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default AsyncResourceContent;
