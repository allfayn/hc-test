import { useEffect, useRef, useState } from "react";
import { isEqual } from "lodash-es";

interface UseFetchConfig<A, R> {
  fn?: (args: A) => Promise<R>;
  args: A;
}

type UseFetchState<R> = { loading: boolean; error?: Error; data?: R };

// type useFetch<A, R> = (props: UseFetchConfig<A, R>) => UseFetchState<R>;

export type useFetchProps = { url: string };

const usePrevious = <A>(value: A) => {
  const ref = useRef<A>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useFetch = <A, R>(
  props: UseFetchConfig<A, R>
): UseFetchState<R> => {
  const [data, setResponse] = useState<R>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setIsLoading] = useState(false);
  const previousArgs = usePrevious<A>(props.args);
  useEffect(() => {
    const fetchData = async (args: A) => {
      setIsLoading(true);
      try {
        if (props?.fn) {
          const result: R = await props.fn(props.args);
          setResponse(result);
        }
        setError(undefined);
      } catch (errorMessage) {
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isEqual(previousArgs, props.args)) {
      fetchData(props.args);
    }
  }, Object.values(props.args));
  return { data, error, loading };
};
