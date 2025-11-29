import '@sky-modules/design/Box/global'

import { Show, onMount, createSignal, createMemo , onCleanup} from 'solid-js';

    export interface CanvasProps extends CanvasJSXRendererParameters {
children: Mitosis.Children;
size?: () => [number, number];
showFps?: boolean;
}

    import  Mitosis from '@sky-modules/universal/Mitosis';
import  { CanvasJSXRenderer, CanvasJSXRendererParameters } from '#/jsx';

    function Canvas(props:CanvasProps) {

    // Preserved local variables (added by local-vars-plugin)
    const size = props.size;
    const showFps = props.showFps ?? true;

const [fps, setFps] = createSignal(0)

        let containerRef: HTMLDivElement;
let canvasRef: HTMLCanvasElement;
let rendererRef: CanvasJSXRenderer | null = null;
let fpsCounter = 0;
let lastFpsUpdate = 0;
let frameId: number | null = null;

        onMount(() => { rendererRef = new CanvasJSXRenderer({
...props,
canvas: props.canvas ?? canvasRef
});
rendererRef.render(props.children);
canvasRef ??= rendererRef.canvas.domElement;
function onFrame(timestamp: number): void {
const [w, h] = size ? size() : [window.innerWidth, window.innerHeight];
canvasRef.width = w;
canvasRef.height = h;

// FPS calculation
fpsCounter++;
if (timestamp - lastFpsUpdate >= 1000) {
    setFps(Math.round(fpsCounter * 1000 / (timestamp - lastFpsUpdate)));
    fpsCounter = 0;
    lastFpsUpdate = timestamp;
}
frameId = requestAnimationFrame(onFrame);
}
frameId = requestAnimationFrame(onFrame);

// Cleanup
onCleanup(() => {
rendererRef?.dispose();
if (frameId !== null) {
    cancelAnimationFrame(frameId);
}
}); })

        return (<>
            <><Show  when={props.container == null && props.canvas == null} ><Box  sx="overflow-hidden position-relative"  ref={containerRef!} ><Box  as="canvas"  ref={canvasRef!} ></Box>
<Show  when={showFps} ><div  style={{
"position": 'absolute',
"top": 0,
"left": 0,
"padding": '8px',
"background-color": 'rgba(0, 0, 0, 0.8)',
"color": 'white',
"font-family": 'monospace',
"font-size": '14px',
"z-index": 1000,
"pointer-events": 'none'
}} >
                                                    FPS:
{fps()}</div></Show></Box></Show></>

            </>)
    }

    export default Canvas;
