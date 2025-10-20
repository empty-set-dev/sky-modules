import '@sky-modules/design/Box/global'

import { Show, onMount } from 'solid-js';

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

let canvasRef: HTMLCanvasElement;

    onMount(() => { rendererRef = new CanvasJSXRenderer({
...props,
canvas: props.canvas ?? canvasRef
});
rendererRef.render(children);
canvasRef ??= rendererRef.canvas.domElement })

    return (<>
      <><Show  when={props.container == null && props.canvas == null} ><div  style={{
"width": (w ?? width ?? 100) * rendererRef.canvas.pixelRatio,
"height": (h ?? height ?? 100) * rendererRef.canvas.pixelRatio,
"overflow": 'hidden'
}} ><canvas  ref={canvasRef!} ></canvas></div></Show></>

      </>)
  }

  export default Canvas;
