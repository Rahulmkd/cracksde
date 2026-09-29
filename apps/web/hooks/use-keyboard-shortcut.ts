"use client";

import { useEffect } from "react";

export interface ShortcutOptions {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut(
  shortcut: ShortcutOptions,
  callback: (e: KeyboardEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
      const matchesMeta =
        shortcut.metaKey === undefined
          ? true
          : (e.metaKey || e.ctrlKey) === shortcut.metaKey;
      const matchesCtrl =
        shortcut.ctrlKey === undefined ? true : e.ctrlKey === shortcut.ctrlKey;
      const matchesAlt =
        shortcut.altKey === undefined ? true : e.altKey === shortcut.altKey;
      const matchesShift =
        shortcut.shiftKey === undefined ? true : e.shiftKey === shortcut.shiftKey;

      if (matchesKey && matchesMeta && matchesCtrl && matchesAlt && matchesShift) {
        if (shortcut.preventDefault) {
          e.preventDefault();
        }
        callback(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut, callback, enabled]);
}
