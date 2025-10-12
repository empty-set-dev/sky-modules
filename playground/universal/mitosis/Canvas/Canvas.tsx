'use client';
import * as React from 'react';

import { useRef, useEffect } from 'react'

  export interface CanvasProps extends CanvasJSXRendererParameters {
children: Mitosis.Children;
}

  import  { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx';
import  CanvasContextProvider from './CanvasContextProvider';

  function Canvas(props:CanvasProps) {

  const rendererRef = useRef<CanvasJSXRenderer>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
      rendererRef.current = new CanvasJSXRenderer({
...props,
canvas: props.canvas ?? canvasRef.current
});
rendererRef.current.render(props.children);
canvasRef.current ??= rendererRef.current.canvas.domElement
    }, [])

return (

  props.container == null && props.canvas == null ? (
  <div  style={{
width: '10000px',
height: '10000px',
overflow: 'hidden'
}}><canvas  ref={canvasRef}  /></div>
) : null

);
}

  export default Canvas;

