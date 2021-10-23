import * as React from 'react';

interface State {
  error?: Error,
  errorMessage?: string;
}

export interface Props<E extends unknown = Error> {
  errorMessage?: React.ReactComponentElement<any> | string | ((error: E) => string | React.ReactComponentElement<any>);
  // todo: flag to reset the error and errorMessage states and try to render the content again
  // retry?: boolean;
}

class AsyncResourceErrorBoundary<CustomErrorType> extends React.Component<Props<CustomErrorType>, State> {
  public static getDerivedStateFromError(error: Error) {
    return { error };
  }

  public static getDerivedStateFromProps({ errorMessage }: Props, state: State) {
    if (state.error) {
      return {
        errorMessage: typeof errorMessage === 'function'
          ? errorMessage(state.error)
          : (errorMessage || state.error.message),
      };
    }
    return state;
  }

  // todo: log this somewhere
  // public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {}

  constructor(props: Props<CustomErrorType>) {
    super(props);

    this.state = {};
  }

  public render() {
    if (this.state.errorMessage) {
      return this.state.errorMessage;
    }

    return this.props.children;
  }
}

export default AsyncResourceErrorBoundary;
