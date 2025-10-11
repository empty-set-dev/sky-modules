'use client';
import * as React from 'react';

import { useRef } from 'react'

  export interface CanvasProps extends CanvasJSXRendererParameters {
children: Mitosis.Children;
}

  import  { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx';

  function Canvas(props:CanvasProps) {

  const renderer = useRef<CanvasJSXRenderer>(null);

  const hasInitialized = useRef(false);
  if (!hasInitialized.current) {
    renderer.current = new CanvasJSXRenderer(props);
renderer.current.render(props.children)
    hasInitialized.current = true;
  }

return (
<>

</>
);
}

  export default Canvas;

