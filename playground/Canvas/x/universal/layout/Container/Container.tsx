import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Container.lite.css'

export type ContainerProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof containerRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { containerRecipe } from './Container.recipe';

  function Container<T extends BoxAs = 'div'>(props:ContainerProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const size = props.size;
  const fluid = props.fluid;
  const centerContent = props.centerContent;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ size, fluid, centerContent, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? containerRecipe)({ size, fluid, centerContent });

let inputRef;

    return (<>
      <Box  {...(boxProps)}  ref={inputRef!}  sx={clsx(sx, styles)} >{props.children}</Box>

      </>)
  }

  export default Container;
