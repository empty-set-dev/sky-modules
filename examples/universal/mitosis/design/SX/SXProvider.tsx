"use client";
import * as React from "react";
import { useState, useContext } from "react";

export interface SXProviderProps {
  children?: Mitosis.Children;
  brand?: string;
  brands: Record<string, Brand>;
  initialMode?: "light" | "dark";
  initialPalette?: string;
}

import Brand from "../Brand";
import SXContext from "./SX.context.js";

function SXProvider(props: SXProviderProps) {
  const [brands, setBrands] = useState(() => props.brands);

  const [brand, setBrand] = useState(() => props.brand);

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
