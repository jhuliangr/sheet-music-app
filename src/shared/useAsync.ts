import {
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export function useAsync<Type>(
  fn: (initial: boolean) => Promise<Type>,
  deps: unknown[] = [],
): [Type | undefined, { refresh: () => void }] {
  const fnRef = useRef(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  const [promise, setPromise] = useState<Promise<Type>>();

  useEffect(() => {
    setPromise(fnRef.current(true));
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    setPromise(fnRef.current(false));
  }, []);

  const value = promise && use(promise);

  return [value, { refresh }];
}
