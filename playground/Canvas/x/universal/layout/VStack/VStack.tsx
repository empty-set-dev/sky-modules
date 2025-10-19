import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

export type VStackProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof vstackRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { vstackRecipe } from './VStack.recipe';

  function VStack(props:VStackProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const spacing = props.spacing;
  const align = props.align;
  const justify = props.justify;
  const wrap = props.wrap;
  const reverse = props.reverse;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ spacing, align, justify, wrap, reverse, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ?? vstackRecipe({ spacing, align, justify, wrap, reverse });

return (<>
      <Box  ref={inputRef!}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)} >{props.children}</Box>

      </>)
  }

  export default forwardRef(VStack) as typeof VStack
