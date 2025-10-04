import * as React from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import { linkRecipe } from "./Link.recipe.js";

const Link = forwardRef<Design.SlotProps<T, typeof linkRecipe>["inputRef"]>(
  function Link(props: Design.SlotProps<T, typeof linkRecipe>, inputRef) {
      // Preserved local variables (added by local-vars-plugin)
  const inputRef = props.inputRef;
  const restProps = props.restProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

return (
      <Box
        ref={inputRef}
        {...restProps}
        as={as ?? ("a" as T)}
        sx={clsx(props.sx, unstyled || styles)}
      >
        {props.children}
      </Box>
    );
  }
);

export default Link;
