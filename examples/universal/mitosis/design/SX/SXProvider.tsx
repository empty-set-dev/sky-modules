'use client';
import * as React from 'react';

import { useState, useContext, useEffect } from 'react'

  export interface SXProviderProps {
children?: Mitosis.Children;
brand?: string;
initialTheme?: 'light' | 'dark';
initialPalette?: string;
}

  import  SXContext from './SX.context.js';

  function SXProvider(props:SXProviderProps) {

    // Preserved local variables (added by local-vars-plugin)
  const state = useStore({
        brand: props.brand,
        theme: props.initialTheme ?? 'light',
        palette: props.initialPalette,
        changeBrand(brand: string) {
            state.brand = brand
        },
        toggleTheme() {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
        },
        changePalette(palette: string) {
            state.palette = palette
        },
    })
    onMount(() => {
        state.brand && document.body.setAttribute('data-brand', state.brand)

        state.palette
            ? state.palette && document.body.setAttribute('data-theme', state.palette)
            : state.theme && document.body.setAttribute('data-theme', state.theme)
    })
    onUnMount(() => {
        document.body.removeAttribute('brand')
        document.body.removeAttribute('theme')
    })
    setContext(SXContext, {
        brand: state.brand,
        theme: state.theme,
        palette: state.palette,
        changeBrand: state.changeBrand,
        toggleTheme: state.toggleTheme,
        changePalette: state.changePalette,
    });

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
palette ? palette && document.body.setAttribute('data-theme', palette) : theme && document.body.setAttribute('data-theme', theme)
    }, [])

useEffect(() => {
      return () => {
        document.body.removeAttribute('brand');
document.body.removeAttribute('theme')
      }
    }, [])

return (

  <SXContext.Provider  value={{
brand: brand,
theme: theme,
palette: palette,
changeBrand: changeBrand,
toggleTheme: toggleTheme,
changePalette: changePalette
}}><>{props.children}</></SXContext.Provider>

);
}

  export default SXProvider;

