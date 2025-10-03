"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { layoutRootRecipe } from "./Layout.Root.recipe.js";

function LayoutRoot(props: Design.SlotProps<T, typeof layoutRootRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const rootRef = useRef(null);

  return (
    <Box
      ref={rootRef}
      {...restProps}
      as={as ?? ("div" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default LayoutRoot;
