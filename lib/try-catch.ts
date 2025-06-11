type AttemptSuccess<T> = readonly [T, null];
type AttemptFailure<E> = readonly [null, E];
type AttemptResult<E, T> = AttemptSuccess<T> | AttemptFailure<E>;
type AttemptResultAsync<E, T> = Promise<AttemptResult<E, T>>;

export function attempt<E = Error, T = Promise<any>>(
  operation: T,
): AttemptResultAsync<E, T>;
export function attempt<E = Error, T = any>(
  operation: () => T,
): AttemptResult<E, T>;
export function attempt<E = Error, T = any>(
  operation: Promise<T> | (() => T),
): AttemptResult<E, T> | AttemptResultAsync<E, T> {
  if (operation instanceof Promise) {
    return operation
      .then((value: T) => [value, null] as const)
      .catch((error: E) => [null, error] as const);
  }

  try {
    const data = operation();
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}
