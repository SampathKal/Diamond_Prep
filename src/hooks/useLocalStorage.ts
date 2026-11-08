import { useCallback, useEffect, useState } from "react"

/** Tiny persistent state hook. Fails soft if storage is blocked. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable: keep in-memory state */
    }
  }, [key, value])
  const set = useCallback((v: T | ((p: T) => T)) => setValue(v), [])
  return [value, set] as const
}
