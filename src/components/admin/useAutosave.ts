"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `save` every `ms` while `enabled` and the value has changed since the last save.
 * `save` is read through a ref so a changing closure never resets the timer.
 */
export function useAutosave<T>(value: T, dirty: boolean, enabled: boolean, save: () => void, ms = 10_000) {
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    if (!enabled || !dirty) return;
    const t = setTimeout(() => saveRef.current(), ms);
    return () => clearTimeout(t);
  }, [value, dirty, enabled, ms]);
}
