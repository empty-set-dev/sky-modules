import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Field.ErrorText.lite.css'

export type FieldErrorTextProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof fieldErrorTextRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { fieldErrorTextRecipe } from './Field.ErrorText.recipe';

  function FieldErrorText<T extends BoxAs = 'div'>(props:FieldErrorTextProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? fieldErrorTextRecipe({}));

let inputRef;

    return (<>
      <Box  {...(boxProps)}  ref={inputRef!}  sx={clsx(sx, styles)} >{props.children}</Box>

      </>)
  }

  export default FieldErrorText;
