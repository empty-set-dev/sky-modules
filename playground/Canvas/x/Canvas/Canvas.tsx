import { Show, onMount } from 'solid-js';

  export interface CanvasProps extends CanvasJSXRendererParameters {
children: Mitosis.Children;
}

  import  { CanvasJSXRenderer, CanvasJSXRendererParameters } from '@sky-modules/canvas/jsx';

  function Canvas(props:CanvasProps) {

    let canvasRef: HTMLCanvasElement;

    onMount(() => { rendererRef = new CanvasJSXRenderer({
...props,
canvas: props.canvas ?? canvasRef
});
rendererRef.render(props.children);
canvasRef ??= rendererRef.canvas.domElement })

    return (<>
      <><Show  when={props.container == null && props.canvas == null} ><div  style={{
"width": '10000px',
"height": '10000px',
"overflow": 'hidden'
}} ><canvas  ref={canvasRef!} ></canvas></div></Show></>

      </>)
  }

  export default Canvas;
