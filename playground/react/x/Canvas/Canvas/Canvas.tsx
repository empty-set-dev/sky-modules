import '@sky-modules/design/Box/global'

'use client';
import * as React from 'react';

import { useRef, useEffect } from 'react'

  export interface CanvasProps extends CanvasJSXRendererParameters {
children: Mitosis.Children;
size?: () => [number, number];
}

  import  { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx';
import  Mitosis from '@sky-modules/universal/Mitosis';

  function Canvas(props:CanvasProps) {

    // Preserved local variables (added by local-vars-plugin)
  const size = props.size;

const rendererRef = useRef<CanvasJSXRenderer>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
const frameId = useRef<number>(null);

useEffect(() => {
      rendererRef.current = new CanvasJSXRenderer({
...props,
canvas: props.canvas ?? canvasRef.current
});
rendererRef.current.render(props.children);
canvasRef.current ??= rendererRef.current.canvas.domElement;
function onFrame(): void {
const [w, h] = size ? size() : [window.innerWidth, window.innerHeight];
canvasRef.current.width = w;
canvasRef.current.height = h;
frameId.current = requestAnimationFrame(onFrame);
}
frameId.current = requestAnimationFrame(onFrame)
    }, [])

useEffect(() => {
      return () => {
        rendererRef.current?.dispose();
cancelAnimationFrame(frameId.current)
      }
    }, [])

return (

  props.container == null && props.canvas == null ? (
  <Box  sx="overflow-hidden"  ref={containerRef}><Box  as="canvas"  ref={canvasRef}  /></Box>
) : null

);
}

  export default Canvas;

