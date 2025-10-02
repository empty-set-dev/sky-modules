"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { gridRecipe } from "./Grid.recipe.js";

function Grid(props: Design.SlotProps<T, typeof gridRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = (({ underline, subtle, unstyled, recipe, as, ...rest }) => rest)(props);
  const as = props.as;
  const unstyled = props.unstyled;
  const styles = (props.recipe ?? linkRecipe({ underline: props.underline, subtle: props.subtle }));

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
