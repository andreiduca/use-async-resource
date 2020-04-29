import React, { ReactNode } from 'react';
import AsyncResourceErrorBoundary, { Props as ErrorBoundaryProps } from './AsyncResourceErrorBoundary';

interface AsyncResourceContentProps {
  fallback: NonNullable<ReactNode> | null;
  errorComponent?: React.ComponentType<any>;
}

type Props<T> = AsyncResourceContentProps & ErrorBoundaryProps<T>;

const AsyncResourceContent = <T extends any = Error>({
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
