"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { colRecipe } from "./Col.recipe.js";

function Col(props: Design.SlotProps<T, typeof colRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const colRef = useRef(null);

  return (
    <Box
      ref={colRef}
      {...restProps}
      as={as ?? ("div" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default Col;
