'use client';
import * as React from 'react';

import { useContext } from 'react'

  interface CanvasContextProviderProps {
value: HTMLCanvasElement;
children: Mitosis.Children;
}

  import  CanvasContext from './Canvas.context';

  function CanvasContextProvider(props:CanvasContextProviderProps) {

  return (

  <CanvasContext.Provider  value={{
value: props.value
}}><>{props.children}</></CanvasContext.Provider>

);
}

  export default CanvasContextProvider;

