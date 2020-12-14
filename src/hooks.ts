import { useCallback, useEffect, useState } from "react";

export function useBoolean(
  initialValue: boolean,
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);
  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);
  const toggle = useCallback(() => setValue(!value), [setValue, value]);
  return [value, setTrue, setFalse, toggle];
}

export function useInterval(callback: () => void, ms: number) {
  useEffect(() => {
    const handle = setInterval(callback, ms);
    return () => clearInterval(handle);
  }, [callback, ms]);
}
