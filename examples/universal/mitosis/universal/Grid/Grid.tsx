import * as React from 'react';

import { forwardRef } from 'react'

  import  clsx from 'clsx';
import  { gridRecipe } from './Grid.recipe.js';

  const Grid = forwardRef<Design.SlotProps<T, typeof gridRecipe>["inputRef"]>(function Grid<T extends TagName = 'div'>(props:Design.SlotProps<T, typeof gridRecipe>,inputRef) {

    // Preserved local variables (added by local-vars-plugin)
  const columns = props.columns;
  const rows = props.rows;
  const gap = props.gap;
  const columnGap = props.columnGap;
  const rowGap = props.rowGap;
  const areas = props.areas;
  const autoFlow = props.autoFlow;
  const autoColumns = props.autoColumns;
  const autoRows = props.autoRows;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ columns, rows, gap, columnGap, rowGap, areas, autoFlow, autoColumns, autoRows, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        gridRecipe({
            columns,
            rows,
            gap,
            columnGap,
            rowGap,
            areas,
            autoFlow,
            autoColumns,
            autoRows,
        });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
})

  export default Grid;

