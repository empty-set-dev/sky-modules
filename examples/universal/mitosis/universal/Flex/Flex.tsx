"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { flexRecipe } from "./Flex.recipe.js";

function Flex(props: Design.SlotProps<T, typeof flexRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const flexRef = useRef(null);

  return (
    <Box
      ref={flexRef}
      {...restProps}
      as={as ?? ("div" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default Flex;
