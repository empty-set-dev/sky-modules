"use client";
import * as React from "react";
import { useContext } from "react";

export interface SlotRootProviderProps {
  children?: Mitosis.Children;
  sx: SlotRootStyles;
  store: SlotRootStore;
}

import SlotRootContext from "./SlotRoot.context";
import { SlotRootStore, SlotRootStyles } from "./types";

function SlotRootProvider(props: SlotRootProviderProps) {
  return (
    <SlotRootContext.Provider
      value={{
        sx: props.sx,
        store: props.store,
      }}
    >
      <>{props.children}</>
    </SlotRootContext.Provider>
  );
}

export default SlotRootProvider;
