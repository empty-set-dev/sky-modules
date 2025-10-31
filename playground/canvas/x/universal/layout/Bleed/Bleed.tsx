import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Bleed.lite.css'

import { createSignal, createMemo } from 'solid-js';

  export type BleedProps<T extends BoxAs = 'div'> = Design.SlotRootProps<T> & {
inline?: string | number;
block?: string | number;
inlineStart?: string | number;
inlineEnd?: string | number;
blockStart?: string | number;
blockEnd?: string | number;
//
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { bleedRecipe } from './Bleed.recipe';

  function Bleed<T extends BoxAs = 'div'>(props:BleedProps<T>) {

  // Preserved local variables (added by local-vars-plugin)
  const inline = props.inline;
  const block = props.block;
  const inlineStart = props.inlineStart;
  const inlineEnd = props.inlineEnd;
  const blockStart = props.blockStart;
  const blockEnd = props.blockEnd;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const boxProps = (({ inline, block, inlineStart, inlineEnd, blockStart, blockEnd, inputRef, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        bleedRecipe({
            hasInline: !!inlineProp,
            hasBlock: !!blockProp,
            hasInlineStart: !!inlineStart,
            hasInlineEnd: !!inlineEnd,
            hasBlockStart: !!blockStart,
            hasBlockEnd: !!blockEnd,
        });
  const cssVariables = {
        ...(inlineProp && {
            '--bleed-inline-start': `calc(-1 * ${formatValue(inlineProp)})`,
            '--bleed-inline-end': `calc(-1 * ${formatValue(inlineProp)})`,
        }),
        ...(blockProp && {
            '--bleed-block-start': `calc(-1 * ${formatValue(blockProp)})`,
            '--bleed-block-end': `calc(-1 * ${formatValue(blockProp)})`,
        }),
        ...(inlineStart && { '--bleed-inline-start': `calc(-1 * ${formatValue(inlineStart)})` }),
        ...(inlineEnd && { '--bleed-inline-end': `calc(-1 * ${formatValue(inlineEnd)})` }),
        ...(blockStart && { '--bleed-block-start': `calc(-1 * ${formatValue(blockStart)})` }),
        ...(blockEnd && { '--bleed-block-end': `calc(-1 * ${formatValue(blockEnd)})` }),
    };

function formatValue(value: string | number): string {
if (typeof value === 'number') {
  return `${value}px`;
}
return value;
}

    let inputRef;

    return (<>
      <Box  ref={inputRef!}  as={as}  sx={clsx(props.sx, unstyled || (recipe ?? styles))}  style={{
...props.style,
...cssVariables
}}  {...(boxProps)} >{children}</Box>

      </>)
  }

  export default Bleed;
