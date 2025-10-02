"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { hstackRecipe } from "./HStack.recipe.js";

function HStack(props: Design.SlotProps<T, typeof hstackRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = (({ underline, subtle, unstyled, recipe, as, ...rest }) => rest)(props);
  const as = props.as;
  const unstyled = props.unstyled;
  const styles = (props.recipe ?? linkRecipe({ underline: props.underline, subtle: props.subtle }));

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

export default HStack;
