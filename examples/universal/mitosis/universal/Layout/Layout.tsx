"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { layoutRecipe } from "./Layout.recipe.js";

function Layout(props: Design.SlotProps<T, typeof layoutRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const restProps = (({ underline, subtle, unstyled, recipe, as, ...rest }) => rest)(props);
  const as = props.as;
  const unstyled = props.unstyled;
  const styles = (props.recipe ?? linkRecipe({ underline: props.underline, subtle: props.subtle }));

const layoutRef = useRef(null);

  return (
    <Box
      ref={layoutRef}
      {...restProps}
      as={as ?? ("div" as T)}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {props.children}
    </Box>
  );
}

export default Layout;
