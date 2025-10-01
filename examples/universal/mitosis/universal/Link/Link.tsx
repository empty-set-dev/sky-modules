"use client";
import * as React from "react";
import { useState, useRef } from "react";
import clsx from "clsx";
import getBoxProps from "./Link.props.js";
import { LinkSx } from "./Link.style.js";

function Link(props: DesignSystem.SlotProps<T, typeof LinkSx>) {
  const inputRef = useRef<HTMLElement>(null);
  const [boxProps, setBoxProps] = useState(() => getBoxProps(props));

  const [sx, setSx] = useState(() => LinkSx(props));

  return (
    <Box ref={inputRef} {...boxProps} as={boxProps.as} sx={clsx(sx, props.sx)}>
      {props.children}
    </Box>
  );
}

export default Link;
