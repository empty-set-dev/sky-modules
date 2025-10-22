import '@sky-modules/design/Box/global'

'use client';
import * as React from 'react';

import { useRef, useEffect } from 'react'

  export interface CanvasProps extends CanvasJSXRendererParameters {
children: Mitosis.Children;
width?: number;
height?: number;
w?: number;
h?: number;
}

  import  { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx';

  function Canvas(props:CanvasProps) {

    // Preserved local variables (added by local-vars-plugin)
  const children = props.children;
  const width = props.width;
  const height = props.height;
  const w = props.w;
  const h = props.h;

const rendererRef = useRef<CanvasJSXRenderer>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
      rendererRef.current = new CanvasJSXRenderer({
...props,
canvas: props.canvas ?? canvasRef.current
});
rendererRef.current.render(children);
canvasRef.current ??= rendererRef.current.canvas.domElement
    }, [])

return (

  props.container == null && props.canvas == null ? (
  <div  style={{
width: (w ?? width ?? 100) * rendererRef.current.canvas.pixelRatio,
height: (h ?? height ?? 100) * rendererRef.current.canvas.pixelRatio,
overflow: 'hidden'
}}><canvas  ref={canvasRef}  /></div>
) : null

);
}

  export default Canvas;

