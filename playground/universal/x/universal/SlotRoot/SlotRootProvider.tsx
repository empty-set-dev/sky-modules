'use client';
import * as React from 'react';

import { useContext } from 'react'

  export interface SlotRootProviderProps {
children?: Mitosis.Children;
styles?: SlotRootStyles;
controller?: SlotRootController;
}

  import  SlotRootContext from './SlotRoot.context';
import  { SlotRootController, SlotRootStyles } from './types';

  function SlotRootProvider(props:SlotRootProviderProps) {

  return (

<SlotRootContext.Provider  value={context}><>{props.children}</></SlotRootContext.Provider>

);
}

  export default SlotRootProvider;

