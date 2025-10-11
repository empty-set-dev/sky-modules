import CanvasRenderer from '#/mitosis/Canvas/Canvas'

export default function Canvas(): ReactNode {
    console.log('???')
    return (
        <CanvasRenderer container={document.body}>
            <mesh></mesh>
        </CanvasRenderer>
    )
}
