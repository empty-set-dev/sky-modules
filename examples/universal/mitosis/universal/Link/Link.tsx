"use client";
import * as React from "react";
import { useState, useRef } from "react";
import clsx from "clsx";
import { extractBoxProps } from "./Link.props.js";
import linkStyles from "./Link.styles.js";

function Link(props: DesignSystem.SlotProps<T, typeof linkStyles, void>) {
  const inputRef = useRef(null);
  const [boxProps, setBoxProps] = useState(() => extractBoxProps<T>(props));

  const [sx, setSx] = useState(() => linkStyles(props));

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
