"use client";
import * as React from "react";
import { useState, useRef } from "react";
import clsx from "clsx";
import getBoxProps from "./Link.props.js";
import { link } from "./Link.style.js";

function Link(props: DesignSystem.SlotProps<T, typeof LinkStyle>) {
  const inputRef = useRef(null);
  const [boxProps, setBoxProps] = useState(() => getBoxProps<T>(props));

  const [sx, setSx] = useState(() => LinkStyle(props));

  return (
    <Box
      ref={inputRef}
      {...boxProps}
      as={(boxProps.as ?? "a") as T}
      sx={clsx(sx, props.sx)}
    >
      {props.children}
    </Box>
  );
}

export default Link;
