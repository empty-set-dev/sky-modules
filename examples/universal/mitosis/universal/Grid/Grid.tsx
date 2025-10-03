"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { gridRecipe } from "./Grid.recipe.js";

function Grid(props: Design.SlotProps<T, typeof gridRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const gridRef = useRef(null);

  return (
    <Box
      ref={gridRef}
      {...restProps}
      as={as ?? ("div" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default Grid;
