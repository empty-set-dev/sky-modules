import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Grid.lite.css'

export type GridProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof gridRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  GridItem from './Grid.Item/Grid.Item';
import  { gridRecipe } from './Grid.recipe';

  function Grid<T extends BoxAs = 'div'>(props:GridProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const inline = props.inline;
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
  const sx = props.sx;
  const boxProps = (({ inline, columns, rows, gap, columnGap, rowGap, areas, autoFlow, autoColumns, autoRows, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled ||
        (recipe ??
            gridRecipe({
                inline,
                columns,
                rows,
                gap,
                columnGap,
                rowGap,
                areas,
                autoFlow,
                autoColumns,
                autoRows,
            }));

let inputRef;

    return (<>
      <Box  {...(boxProps)}  ref={inputRef!}  sx={clsx(sx, styles)} >{props.children}</Box>

      </>)
  }
Grid.Item = GridItem;



  export default Grid;
