"use client";
import * as React from "react";
import { useState, useContext } from "react";

export interface SXProviderProps {
  children?: Mitosis.Children;
  initialBrand?: string;
  initialMode?: "light" | "dark";
  initialPalette?: string;
}

import SXContext from "./SX.context.js";

function SXProvider(props: SXProviderProps) {
  const [brand, setBrand] = useState(() => props.initialBrand);

  const [mode, setMode] = useState(() => props.initialMode ?? "light");

  const [palette, setPalette] = useState(() => props.initialPalette);

  function changeBrand(brand: string) {
    setBrand(brand);
  }

  function toggleMode() {
    setMode(mode === "light" ? "dark" : "light");
  }

  function changePalette(palette: string) {
    setPalette(palette);
  }

  return (
    <SXContext.Provider
      value={{
        brand: brand,
        mode: mode,
        palette: palette,
      }}
    >
      <>{props.children}</>
    </SXContext.Provider>
  );
}

export default SXProvider;
