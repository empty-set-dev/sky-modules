"use client";
import * as React from "react";
import { useState, useContext } from "react";

export interface SXProviderProps {
  children?: Mitosis.Children;
  initialMode?: "light" | "dark";
}

import SXContext from "./SX.context";
import { SXContextType } from "./types";
export function useSXContext(): SXContextType {
  return useContext(SXContext);
}

function SXProvider(props: SXProviderProps) {
  const [mode, setMode] = useState(() => initialMode ?? "light");

  function toggleMode() {
    setMode(mode === "light" ? "dark" : "light");
  }

  return <SXContext.Provider value={state} />;
}

export default SXProvider;
