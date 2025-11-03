import '@sky-modules/design/Box/global'

import { Show, onMount } from 'solid-js';

  export interface CanvasProps extends CanvasJSXRendererParameters {
children: Mitosis.Children;
size?: () => [number, number];
}

  import  { CanvasJSXRenderer, CanvasJSXRendererParameters } from '#/jsx';
import  Mitosis from '@sky-modules/universal/Mitosis';

  function Canvas(props:CanvasProps) {

      // Preserved local variables (added by local-vars-plugin)
  const size = props.size;

let containerRef: HTMLDivElement;
let canvasRef: HTMLCanvasElement;

    onMount(() => { rendererRef = new CanvasJSXRenderer({
...props,
canvas: props.canvas ?? canvasRef
});
rendererRef.render(props.children);
canvasRef ??= rendererRef.canvas.domElement;
function onFrame(): void {
const [w, h] = size ? size() : [window.innerWidth, window.innerHeight];
canvasRef.width = w;
canvasRef.height = h;
frameId = requestAnimationFrame(onFrame);
}
frameId = requestAnimationFrame(onFrame) })

    return (<>
      <><Show  when={props.container == null && props.canvas == null} ><Box  sx="overflow-hidden"  ref={containerRef!} ><Box  as="canvas"  ref={canvasRef!} ></Box></Box></Show></>

      </>)
  }

  export default Canvas;
