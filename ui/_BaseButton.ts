import './_UI'
import { TextView } from 'pkgs/troika-three-text'
import Sprite from 'sky/views/Sprite'
import 'sky/Canvas/global'

export interface BaseButtonParams {
    texture?: Three.Texture
    text: string
    x: number
    y: number
    w?: number
    h?: number
    paddingX?: number
    paddingY?: number
    fontSize?: number
    radius?: number
}
export class BaseButton extends Sprite {
    w!: number
    h!: number
    visible!: boolean

    constructor(deps: EffectDeps, params: BaseButtonParams) {
        super(deps)

        this.view.position.x = params.x
        this.view.position.y = params.y

        this.__textView = UI.makeText({
            text: params.text,
            color: 0xffffff,
            fontSize: params.fontSize ?? 20,
            fontWeight: 'normal',
            fillOpacity: 1,
            strokeColor: 0xffffff,
            strokeWidth: 0,
            strokeOpacity: 0,
            outlineBlur: 0,
            outlineColor: 0x000000,
            outlineWidth: 0,
            outlineOpacity: 1,
        })

        this.__hoverTextView = UI.makeText({
            text: params.text,
            color: 0x000000,
            fontSize: params.fontSize ?? 20,
            fontWeight: 'normal',
            fillOpacity: 1,
            strokeColor: 0x000000,
            strokeWidth: 0,
            strokeOpacity: 1,
            outlineBlur: 0,
            outlineColor: 0x000000,
            outlineWidth: 0,
            outlineOpacity: 1,
        })

        this.__pressTextView = UI.makeText({
            text: params.text,
            color: 0xffffff,
            fontSize: params.fontSize ?? 20,
            fontWeight: 'normal',
            fillOpacity: 1,
            strokeColor: 0x000000,
            strokeWidth: 0,
            strokeOpacity: 1,
            outlineBlur: 0,
            outlineColor: 0x000000,
            outlineWidth: 0,
            outlineOpacity: 1,
        })

        return asyncConstructor(async (): Promise<BaseButton> => {
            this.visible = true

            await Promise.all([
                new Promise<void>(resolve => {
                    this.__textView.sync(resolve)
                }),

                new Promise<void>(resolve => {
                    this.__hoverTextView.sync(resolve)
                }),

                new Promise<void>(resolve => {
                    this.__pressTextView.sync(resolve)
                }),
            ])

            this.w =
                params.w ??
                Math.floor(this.__textView.geometry.boundingBox?.max.x! + (params.paddingX ?? 32)) *
                    2
            this.h =
                params.h ??
                Math.floor(this.__textView.geometry.boundingBox?.max.y! + (params.paddingY ?? 2)) *
                    2

            this.__texture = UI.makeTexture({
                w: this.w,
                h: this.h,
                radius: params.radius ?? 16,
                color: 0x000000,
                opacity: 0,
                strokeColor: 0xffffff,
                strokeWidth: 2,
            })

            this.__hoverTexture = UI.makeTexture({
                w: this.w,
                h: this.h,
                radius: params.radius ?? 16,
                color: 0xffffff,
                opacity: 1,
                strokeColor: 0xffffff,
                strokeWidth: 2,
            })

            this.__pressTexture = UI.makeTexture({
                w: this.w,
                h: this.h,
                radius: params.radius ?? 16,
                color: 0x000000,
                opacity: 0.5,
                strokeColor: 0xffffff,
                strokeWidth: 2,
            })

            const geometry = new Three.PlaneGeometry(this.w, this.h, 1, 1)
            const material = (this.__material = new Three.MeshBasicMaterial({
                map: (params && params.texture) ?? this.__texture,
                transparent: true,
            }))
            const plane = (this.__plane = new Three.Mesh(geometry, material))
            plane.position.x = this.w / 2
            plane.position.y = this.h / 2

            this.__textView!.position.x = this.w / 2
            this.__textView!.position.y = this.h / 2
            this.__hoverTextView!.position.x = this.w / 2
            this.__hoverTextView!.position.y = this.h / 2
            this.__pressTextView!.position.x = this.w / 2
            this.__pressTextView!.position.y = this.h / 2

            this.view.add(plane)
            this.view.add(this.__textView)

            this.__updateState()

            return this
        })
    }

    globalMouseMove(ev: MouseMoveEvent): void {
        if (!this.visible) {
            return
        }

        if (ev.isCaptured) {
            this.__hovered = false
            this.__updateState()
            return
        }

        this.__hovered = this.__checkPoint(new Vector2(ev.x, ev.y))

        this.__updateState()

        if (this.__hovered) {
            ev.isCaptured = true
        }
    }

    globalMouseDown(ev: MouseDownEvent): void {
        if (!this.visible) {
            return
        }

        if (ev.isCaptured) {
            return
        }

        if (this.__hovered) {
            this.__waitClick = true

            ev.isCaptured = true
        }

        this.__updateState()
    }

    globalMouseUp(ev: MouseUpEvent): void {
        if (!this.visible) {
            return
        }

        if (ev.isCaptured) {
            return
        }

        if (this.__hovered && this.__waitClick) {
            this._onClick()

            ev.isCaptured = true
        }

        this.__waitClick = false

        this.__updateState()
    }

    protected _onClick(): void {
        //
    }

    private __updateState(): void {
        if (!this.__material) {
            return
        }

        if (this.__hovered) {
            if (this.__waitClick) {
                this.__material.map = this.__pressTexture
                this.view.remove(this.__textView)
                this.view.remove(this.__hoverTextView)
                this.view.add(this.__pressTextView)
            } else {
                this.__material.map = this.__hoverTexture
                this.view.remove(this.__textView)
                this.view.add(this.__hoverTextView)
                this.view.remove(this.__pressTextView)
            }
        } else {
            this.__material.map = this.__texture
            this.__plane.material = this.__material
            this.view.add(this.__textView)
            this.view.remove(this.__hoverTextView)
            this.view.remove(this.__pressTextView)
        }
    }

    private __checkPoint(point: Vector2): boolean {
        if (point.x >= 0 && point.x <= this.w) {
            if (point.y >= 0 && point.y <= this.h) {
                return true
            }
        }

        return false
    }

    private __updateZOrder(ev: UpdateZOrderEvent): void {
        this.__plane.renderOrder = ev.z
        ++ev.z
        this.__textView.renderOrder = ev.z
        this.__hoverTextView.renderOrder = ev.z
        this.__pressTextView.renderOrder = ev.z
        ++ev.z
    }

    private __plane!: Three.Mesh
    private __material!: Three.MeshBasicMaterial
    private __hovered: boolean = false
    private __waitClick: boolean = false

    private __texture!: Three.Texture
    private __hoverTexture!: Three.Texture
    private __pressTexture!: Three.Texture

    private __textView: TextView
    private __hoverTextView: TextView
    private __pressTextView: TextView
}
