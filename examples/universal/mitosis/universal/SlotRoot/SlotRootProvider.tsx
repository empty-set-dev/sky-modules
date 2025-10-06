'use client';
import * as React from 'react';

import { useContext } from 'react'

  export interface SlotRootProviderProps {
children?: Mitosis.Children;
sx: SlotRootSx;
state: SlotRootState;
}

  import  SlotRootContext from './SlotRoot.context';
import  { SlotRootState, SlotRootSx } from './types';

  function SlotRootProvider(props:SlotRootProviderProps) {

  return (

  <SlotRootContext.Provider  value={{
sx: props.sx,
state: props.state
}}><>{props.children}</></SlotRootContext.Provider>

);
}

  export default SlotRootProvider;

