import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import * as React from 'react';

export type GridProps<T extends BoxAs = 'div'> = Design.SlotProps<T, typeof gridRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { gridRecipe } from './Grid.recipe';

  function Grid<T extends BoxAs = 'div'>(props:GridProps<T>, inputRef?: unknown) {


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

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div'}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default forwardRef(Grid) as typeof Grid

