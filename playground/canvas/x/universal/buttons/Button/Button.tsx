import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Button.lite.css'

import { Show } from 'solid-js';

  export type ButtonProps<T extends BoxAs = 'button'> = Design.SlotRootProps<typeof buttonRecipe, T> & {
inputRef?: unknown;
spinnerPlacement?: 'start' | 'end' | undefined;
loadingText?: Mitosis.Node;
spinner?: Mitosis.Node;
}

  import  Mitosis from '@sky-modules/universal/Mitosis';
import  clsx from 'clsx';
import  { buttonRecipe } from './Button.recipe';

  function Button<T extends BoxAs = 'button'>(props:ButtonProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const spinnerPlacement = props.spinnerPlacement;
  const loadingText = props.loadingText;
  const spinner = props.spinner;
  const colorPalette = props.colorPalette;
  const size = props.size;
  const variant = props.variant;
  const loading = props.loading;
  const highContrast = props.highContrast;
  const rounded = props.rounded;
  const disabled = props.disabled;
  const brand = props.brand;
  const primary = props.primary;
  const secondary = props.secondary;
  const tertiary = props.tertiary;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const sx = props.sx;
  const restProps = (({ spinnerPlacement, loadingText, spinner, colorPalette, size, variant, loading, highContrast, rounded, disabled, brand, primary, secondary, tertiary, inputRef, unstyled, recipe, as, sx, ...rest }) => rest)(props);
  const styles = unstyled ||
        (recipe ??
            buttonRecipe({
                size,
                variant,
                loading,
                highContrast,
                rounded,
                disabled,
                brand,
                primary,
                secondary,
                tertiary,
            }));

let inputRef;

    return (<>
      <Box  ref={inputRef!}  {...(restProps)}  as={as ?? 'button'}  disabled={disabled}  sx={clsx(sx, styles)}  data-color-palette={colorPalette} ><Show  when={loading} ><span  class="button__loading" >⏳</span></Show>
{props.children}</Box>

      </>)
  }

  export default Button;
