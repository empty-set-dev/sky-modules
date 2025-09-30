"use client";
import * as React from "react";
import { useState, useContext, useRef } from "react";
import { cx } from "@sky-modules/helpers/cn";
import { SlotRootContext } from "../../SlotRoot/index.js";

function LinkRoot(props: BoxProps<T>) {
  const inputRef = useRef<HTMLElement>(null);
  const [boxProps, setBoxProps] = useState(() => getBoxProps(props));

  const root = useContext(SlotRootContext);

  return (
    <Box ref={inputRef} {...boxProps} sx={cx(root.sx.root, props.sx)}>
      {props.children}
    </Box>
  );
}

export default LinkRoot;
