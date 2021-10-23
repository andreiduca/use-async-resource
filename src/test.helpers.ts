// mimics how Suspense treats thrown promises
export async function suspendFor<T extends () => unknown>(throwablePromise: T) {
  // initially, the data reader throws the new promise
  expect(throwablePromise).toThrow();

  try {
    // calling the function will throw the promise
    throwablePromise();
  } catch(tp) {
    // Suspense will catch it and wait its fulfilment
    await tp;
    expect('awaited successfully').toBeTruthy();
  }
}
