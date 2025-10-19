import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Layout.Root.lite.css'

export type LayoutRootProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof layoutRootRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { layoutRootRecipe } from './Layout.Root.recipe';

  function LayoutRoot(props:LayoutRootProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const fullHeight = props.fullHeight;
  const fullWidth = props.fullWidth;
  const overflow = props.overflow;
  const direction = props.direction;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ fullHeight, fullWidth, overflow, direction, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        layoutRootRecipe({
            // variant,
            fullHeight,
            fullWidth,
            overflow,
            direction,
        });

return (<>
      <Box  ref={inputRef!}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)} >{props.children}</Box>

      </>)
  }

  export default forwardRef(LayoutRoot) as typeof LayoutRoot
