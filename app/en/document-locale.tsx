"use client";

import { useEffect } from "react";

export function DocumentLocale() {
  useEffect(() => {
    const root = document.documentElement;
    const previousLanguage = root.lang;
    const previousDirection = root.dir;
    root.lang = "en";
    root.dir = "ltr";
    return () => {
      root.lang = previousLanguage;
      root.dir = previousDirection;
    };
  }, []);
  return null;
}
