"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { rowRecipe } from "./Row.recipe.js";

function Row(props: Design.SlotProps<T, typeof rowRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const rowRef = useRef(null);

  return (
    <Box
      ref={rowRef}
      {...restProps}
      as={as ?? ("div" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default Row;
