import * as React from 'react';

  export type AspectRatioProps<T extends BoxAs = 'div'> = Design.SlotRootProps<T, typeof aspectRatioRecipe> & {
inputRef?: unknown;
}

  import  { aspectRatioRecipe } from './AspectRatio.recipe';
import  AspectRatioRoot from './AspectRatio.Root';
import  AspectRatioContent from './slots/AspectRatio.Content';

  function AspectRatio(props:AspectRatioProps<T>) {

  return (

<AspectRatioRoot  {...(props)}><AspectRatioContent>{props.children}</AspectRatioContent></AspectRatioRoot>

);
}

  export default AspectRatio;

