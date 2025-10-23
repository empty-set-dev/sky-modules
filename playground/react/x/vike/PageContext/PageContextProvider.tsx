'use client';
import * as React from 'react';

import { useContext } from 'react'

  export interface PageContextProviderProps {
children?: Mitosis.Children;
value: Vike.PageContext;
}

  import  Mitosis from '@sky-modules/universal/Mitosis';
import  PageContext from './Page.context';

  function PageContextProvider(props:PageContextProviderProps) {

  return (

<PageContext.Provider  value={props.value}><>{props.children}</></PageContext.Provider>

);
}

  export default PageContextProvider;

