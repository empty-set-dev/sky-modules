import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Button.lite.css'

import * as React from 'react';

export type ButtonProps<T extends BoxAs = 'button'> = Design.SlotRootProps<typeof buttonRecipe, T> & {
inputRef?: unknown;
spinnerPlacement?: 'start' | 'end' | undefined;
colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink' | 'indigo' | 'violet' | 'sky' | 'emerald' | 'lime' | 'amber' | 'rose' | 'fuchsia' | 'slate' | 'zinc' | 'stone';
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
variant?: 'solid' | 'subtle' | 'surface' | 'outline' | 'ghost' | 'plain';
loading?: boolean;
loadingText?: Mitosis.Node;
spinner?: Mitosis.Node;
highContrast?: boolean;
rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
disabled?: boolean;
brand?: boolean;
primary?: boolean;
secondary?: boolean;
tertiary?: boolean;
}

  import  clsx from 'clsx';
import  { buttonRecipe } from './Button.recipe';

  function Button<T extends BoxAs = 'button'>(props:ButtonProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const colorPalette = props.colorPalette;
  const size = props.size;
  const variant = props.variant;
  const loading = props.loading;
  const loadingText = props.loadingText;
  const spinner = props.spinner;
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
  const restProps = (({ colorPalette, size, variant, loading, loadingText, spinner, highContrast, rounded, disabled, brand, primary, secondary, tertiary, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = unstyled ||
        (recipe ??
            buttonRecipe({
                colorPalette,
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

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'button'}  disabled={disabled}  sx={clsx(props.sx, unstyled || styles)}>{loading ? (
<span className="button__loading">⏳</span>
) : null}{props.children}</Box>

);
}

  export default forwardRef(Button) as typeof Button

