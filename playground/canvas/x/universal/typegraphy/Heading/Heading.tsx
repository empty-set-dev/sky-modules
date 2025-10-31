import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Heading.lite.css'

export type HeadingProps<T extends BoxAs = 'h2'> = Design.SlotRootProps<typeof headingRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { headingRecipe } from './Heading.recipe';

  function Heading<T extends BoxAs = 'h2'>(props:HeadingProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const size = props.size;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ size, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? headingRecipe({ size }));

let inputRef;

    return (<>
      <Box  {...(boxProps)}  ref={inputRef!}  sx={clsx(sx, styles)} >{props.children}</Box>

      </>)
  }

  export default Heading;
