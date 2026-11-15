"use client";

import { createContext, useContext } from "react";

const PreviewContext = createContext(false);
export const useStudioPreview = () => useContext(PreviewContext);

export function StudioPreview({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <PreviewContext.Provider value={enabled}>
      {children}
    </PreviewContext.Provider>
  );
}
