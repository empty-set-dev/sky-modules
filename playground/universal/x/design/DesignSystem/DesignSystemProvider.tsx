'use client';
import * as React from 'react';

import { useState, useContext, useEffect } from 'react'

  export interface DesignSystemProviderProps {
children?: Mitosis.Children;
brand?: string;
initialTheme?: 'light' | 'dark';
initialPalette?: string;
}

  import  DesignSystemContext from './DesignSystem.context';

  function DesignSystemProvider(props:DesignSystemProviderProps) {

  const [brand, setBrand] = useState(() => (props.brand))

const [theme, setTheme] = useState(() => (props.initialTheme ?? 'light'))

const [palette, setPalette] = useState(() => (props.initialPalette))

function changeBrand(brand: string) {
setBrand(brand);
}

function toggleTheme() {
setTheme(theme === 'light' ? 'dark' : 'light');
}

function changePalette(palette: string) {
setPalette(palette);
}

useEffect(() => {
      brand && document.body.setAttribute('data-brand', brand);
theme && document.body.setAttribute('data-theme', theme);
palette && document.body.setAttribute('data-palette', palette)
    }, [])

useEffect(() => {
      return () => {
        document.body.removeAttribute('brand');
document.body.removeAttribute('theme');
document.body.removeAttribute('palette')
      }
    }, [])

return (

  <DesignSystemContext.Provider  value={{
brand: brand,
theme: theme,
palette: palette,
changeBrand: changeBrand,
toggleTheme: toggleTheme,
changePalette: changePalette
}}><>{props.children}</></DesignSystemContext.Provider>

);
}

  export default DesignSystemProvider;

