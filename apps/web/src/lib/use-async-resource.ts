"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isRetryableTrpcError } from "./trpc-retry";

export type AsyncResource<T> =
  | { status: "loading" }
  | { status: "error"; retry: () => void }
  | { status: "ready"; data: T; pending: boolean };

type UseAsyncResourceOptions<T> = {
  readonly initialData?: T;
  readonly deps?: readonly unknown[];
};

type UseAsyncResourceResult<T> = {
  readonly state: AsyncResource<T>;
  readonly refresh: () => void;
};

const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 800;

export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  options?: UseAsyncResourceOptions<T>,
): UseAsyncResourceResult<T> {
  const { initialData, deps = [] } = options ?? {};
  const hasInitialData = initialData !== undefined;
  const depsKey = JSON.stringify(deps);

  const [state, setState] = useState<AsyncResource<T>>(() =>
    hasInitialData
      ? { status: "ready", data: initialData as T, pending: false }
      : { status: "loading" },
  );

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const requestIdRef = useRef(0);
  const isFirstRunRef = useRef(true);

  const load = useCallback((): void => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    let attempt = 0;

    setState((prev) =>
      prev.status === "ready" ? { ...prev, pending: true } : { status: "loading" },
    );

    const attemptFetch = (): void => {
      fetcherRef
        .current()
        .then((data) => {
          if (requestIdRef.current !== requestId) return;
          setState({ status: "ready", data, pending: false });
        })
        .catch((error: unknown) => {
          if (requestIdRef.current !== requestId) return;
          attempt += 1;
          if (attempt < MAX_ATTEMPTS && isRetryableTrpcError(error)) {
            setTimeout(attemptFetch, RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
          } else {
            setState({ status: "error", retry: load });
          }
        });
    };

    attemptFetch();
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      if (hasInitialData) return;
    }
    load();
  }, [depsKey, hasInitialData, load]);

  return { state, refresh: load };
}
