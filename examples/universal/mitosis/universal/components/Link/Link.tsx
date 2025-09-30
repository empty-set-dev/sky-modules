"use client";
import * as React from "react";
import { useState, useRef } from "react";
import { tv } from "tailwind-variants";
import { SlotRootProvider } from "../../SlotRoot/index.js";
import LinkRoot from "./LinkRoot.js";
import LinkSub from "./LinkSub.js";
const LinkSx = tv({
  slots: {
    root: "bg-red-400",
    sub: "bg-amber-600",
  },
  variants: {
    underline: {
      true: {
        sub: "underline",
      },
    },
  },
});

function Link(props: DesignSystem.SlotProps<T, typeof LinkSx>) {
  const inputRef = useRef<HTMLElement>(null);
  const [sx, setSx] = useState(() => LinkSx(props));

  const [boxProps, setBoxProps] = useState(() => getBoxProps(props));

  return (
    <SlotRootProvider
      sx={{
        root: sx.root(props),
        sub: sx.sub(props),
      }}
      state={{}}
    >
      <LinkRoot ref={inputRef} {...boxProps}>
        <LinkSub>sub</LinkSub>
        {props.children}
      </LinkRoot>
    </SlotRootProvider>
  );
}

export default Link;
