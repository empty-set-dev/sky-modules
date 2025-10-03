"use client";
import * as React from "react";
import { useRef } from "react";
import clsx from "clsx";
import { buttonRecipe } from "./Button.recipe.js";

function Button(props: Design.SlotProps<T, typeof buttonRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
  const disabled = props.disabled;
  const restProps = props.restProps;
  const as = props.as;
  const loading = props.loading;
  const styles = props.styles;
  const unstyled = props.unstyled;

const buttonRef = useRef(null);

  return (
    <Box
      ref={buttonRef}
      {...restProps}
      as={as ?? ("button" as T)}
      disabled={disabled}
      sx={clsx(props.sx, unstyled || styles)}
    >
      {loading ? <span className="button__loading">⏳</span> : null}
      {props.children}
    </Box>
  );
}

export default Button;
