import Vector2 from 'sky/math/Vector2'
import SkyRenderer from 'sky/renderers/SkyRenderer'

export default class MouseController extends Effect {
    mouse = new Vector2()

    onSkyRendererContext(): void {
        new WindowEventListener(
            'mousemove',
            ev => {
                this.__mouse = new Vector2(ev.clientX, ev.clientY)
                this.__updateMouse()
            },
            [this]
        )
        new WindowEventListener(
            'resize',
            () => {
                this.__updateMouse()
            },
            [this]
        )
    }

    __updateMouse(): void {
        const renderer = this.context(SkyRenderer)
        const [w, h] = renderer.size()
        this.mouse.set((this.__mouse.x / w) * 2 - 1, -(this.__mouse.y / h) * 2 + 1)
    }

    private __mouse: Vector2
}
