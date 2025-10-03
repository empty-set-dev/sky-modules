"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { vstackRecipe } from "./VStack.recipe.js";

function VStack(props: Design.SlotProps<T, typeof vstackRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const stackRef = useRef(null);

  return (
    <Box
      ref={stackRef}
      {...restProps}
      as={as ?? ("div" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default VStack;
