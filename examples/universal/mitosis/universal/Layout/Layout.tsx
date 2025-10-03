"use client";
import * as React from "react";
import { useRef } from "react";

type LayoutProps = Design.SlotProps<T, typeof layoutRecipe> & {
  rootProps?: unknown;
  showHeader?: boolean;
  headerProps?: unknown;
};
import clsx from "clsx";
import LayoutHeader from "./Layout.Header.js";
import { layoutRecipe } from "./Layout.recipe.js";
import LayoutRoot from "./Layout.Root.js";

function Layout(props: LayoutProps) {
    // Preserved local variables (added by local-vars-plugin)
  const fullHeight = props.fullHeight;
  const restProps = props.restProps;
  const rootProps = props.rootProps;
  const showHeader = props.showHeader;
  const headerProps = props.headerProps;
  const as = props.as;
  const styles = props.styles;
  const unstyled = props.unstyled;

const inputRef = useRef(null);

  return (
    <LayoutRoot ref={inputRef} fullHeight={fullHeight}>
      {showHeader ? <LayoutHeader /> : null}
      <Box
        {...restProps}
        as={as ?? ("main" as T)}
        sx={clsx(props.sx, unstyled || styles)}
      >
        {props.children}
      </Box>
    </LayoutRoot>
  );
}

export default Layout;
