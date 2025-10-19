import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Grid.Item.lite.css'

export type GridItemProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof gridItemRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { gridItemRecipe } from './Grid.Item.recipe';

  function GridItem<T extends BoxAs = 'div'>(props:GridItemProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const colSpan = props.colSpan;
  const rowSpan = props.rowSpan;
  const colStart = props.colStart;
  const colEnd = props.colEnd;
  const rowStart = props.rowStart;
  const rowEnd = props.rowEnd;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ colSpan, rowSpan, colStart, colEnd, rowStart, rowEnd, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled ||
        (recipe ??
            gridItemRecipe({
                colSpan,
                rowSpan,
                colStart,
                colEnd,
                rowStart,
                rowEnd,
            }));

let inputRef;

    return (<>
      <Box  {...(boxProps)}  ref={inputRef!}  sx={clsx(sx, styles)} >{props.children}</Box>

      </>)
  }

  export default GridItem;
