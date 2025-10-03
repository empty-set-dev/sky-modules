"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { linkRecipe } from "./Link.recipe.js";

function Link(props: Design.SlotProps<T, typeof linkRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const inputRef = useRef(null);

  return (
    <Box
      ref={inputRef}
      {...restProps}
      as={as ?? ("a" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default Link;
