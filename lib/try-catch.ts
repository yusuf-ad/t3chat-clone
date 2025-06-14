type AttemptSuccess<T> = readonly [T, null];
type AttemptFailure = readonly [null, Error];

// Overload 1: Handle direct Promise
export function attempt<T>(
  operation: Promise<T>,
): Promise<AttemptSuccess<T> | AttemptFailure>;

// Overload 2: Handle synchronous function
export function attempt<T>(
  operation: () => T,
): AttemptSuccess<T> | AttemptFailure;

// Overload 3: Handle async function
export function attempt<T>(
  operation: () => Promise<T>,
): Promise<AttemptSuccess<T> | AttemptFailure>;

// Implementation
export function attempt<T>(
  operation: Promise<T> | (() => T) | (() => Promise<T>),
):
  | AttemptSuccess<T>
  | AttemptFailure
  | Promise<AttemptSuccess<T> | AttemptFailure> {
  // Handle direct Promise
  if (operation instanceof Promise) {
    return operation
      .then((value: T) => [value, null] as const)
      .catch((error: Error) => [null, error] as const);
  }

  // Handle function (sync or async)
  if (typeof operation === "function") {
    try {
      const result = operation();

      // If function returns a Promise
      if (result instanceof Promise) {
        return result
          .then((value: T) => [value, null] as const)
          .catch((error: Error) => [null, error] as const);
      }

      // Synchronous result
      return [result, null] as const;
    } catch (error) {
      return [null, error as Error] as const;
    }
  }

  // Fallback (shouldn't happen with proper types)
  return [null, new Error("Invalid operation type")] as const;
}
