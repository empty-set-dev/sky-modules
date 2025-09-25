import { TextView } from 'pkgs/troika-three-text'
import Sprite from 'sky/Three/views/Sprite'
import Svg, { SvgParameters } from 'sky/Three/views/Svg'

interface ButtonStateParameters {
    text: UI.MakeTextParameters
    texture: UI.MakeRoundedRectTextureParameters
    icon: Omit<SvgParameters, 'path'>
}

export interface BaseOfButtonParameters {
    text: string
    x: number
    y: number
    w?: number
    h?: number
    paddingX?: number
    paddingY?: number

    defaultStateParameters: ButtonStateParameters
    hoverStateParameters: ButtonStateParameters
    activeStateParameters: ButtonStateParameters
    focusStateParameters: ButtonStateParameters

    icon?: string

    rounded?: 'all' | 'top' | 'bottom'

    radius?: number
}
export interface BaseOfButton extends Visibility {}
@mixin(Visibility)
export class BaseOfButton extends Sprite {
    w?: number
    h?: number

    private __plane?: Three.Mesh
    private __material?: Three.MeshBasicMaterial
    private __hovered: boolean = false
    private __waitClick: boolean = false

    private __textures?: {
        __texture: Three.Texture
        __hoverTexture: Three.Texture
        __pressTexture: Three.Texture
    }

    private __strokeWidth: number
    private __hoverStrokeWidth: number
    private __pressStrokeWidth: number

    private __textViews?: {
        __textView?: TextView
        __hoverTextView?: TextView
        __pressTextView?: TextView
    }

    private __icon?: Svg
    private __iconColor?: Three.ColorRepresentation
    private __iconHoverColor?: Three.ColorRepresentation
    private __iconPressColor?: Three.ColorRepresentation

    constructor(deps: EffectDeps, parameters: BaseButtonParameters) {
        super(deps)

        this.__strokeWidth = parameters.textureParams?.strokeWidth ?? 2
        this.__hoverStrokeWidth = parameters.hoverTextureParams?.strokeWidth ?? 2
        this.__pressStrokeWidth = parameters.pressTextureParams?.strokeWidth ?? 2

        this.asyncSlot = this.__asyncConstructor(parameters)
    }

    private async __asyncConstructor(
        this: BaseButton,
        parameters: BaseButtonParameters
    ): Promise<void> {
        const renderer = this.effect.context(Sky.Renderer)

        this.position.x = parameters.x
        this.position.y = parameters.y

        this.__textView = UI.makeText({
            text: parameters.text,
            color: 0xffffff,
            fontSize: 20,

            ...(parameters.textParams ?? {}),
        })

        this.__hoverTextView = UI.makeText({
            text: parameters.text,
            color: 0x000000,
            fontSize: 20,

            ...(parameters.hoverTextParams ?? {}),
        })

        this.__pressTextView = UI.makeText({
            text: parameters.text,
            color: 0xffffff,
            fontSize: 20,

            ...(parameters.pressTextParams ?? {}),
        })

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
            parameters.w ??
            Math.floor(this.__textView.geometry.boundingBox?.max.x! + (parameters.paddingX ?? 32)) *
                2
        this.h =
            parameters.h ??
            Math.floor(this.__textView.geometry.boundingBox?.max.y! + (parameters.paddingY ?? 2)) *
                2

        this.__texture = UI.makeRoundedRectTexture({
            w: this.w,
            h: this.h,
            color: 0x000000,
            opacity: 0,
            strokeColor: 0xffffff,
            strokeWidth: 2,

            radius: parameters.radius ?? 16,

            ...(parameters.textureParams ?? {}),

            pixelRatio: renderer.pixelRatio,
            rounded: parameters.rounded,
        })

        this.__hoverTexture = UI.makeRoundedRectTexture({
            w: this.w,
            h: this.h,
            radius: parameters.radius ?? 16,
            color: 0xffffff,
            opacity: 1,
            strokeColor: 0xffffff,
            strokeWidth: 2,

            ...(parameters.hoverTextureParams ?? {}),

            pixelRatio: renderer.pixelRatio,
            rounded: parameters.rounded,
        })

        this.__pressTexture = UI.makeRoundedRectTexture({
            w: this.w,
            h: this.h,
            radius: parameters.radius ?? 16,
            color: 0x000000,
            opacity: 0.5,
            strokeColor: 0xffffff,
            strokeWidth: 2,

            ...(parameters.pressTextureParams ?? {}),

            pixelRatio: renderer.pixelRatio,
            rounded: parameters.rounded,
        })

        const geometry = new Three.PlaneGeometry(1, 1, 1, 1)
        const material = (this.__material = new Three.MeshBasicMaterial({
            map: this.__texture,
            transparent: true,
            depthWrite: false,
        }))
        const plane = (this.__plane = new Three.Mesh(geometry, material))
        plane.position.x = this.w / 2
        plane.position.y = this.h / 2

        if (parameters.icon) {
            const icon = await new Svg({
                path: parameters.icon,
                ...parameters.iconParams!,
            })
            icon.position.x = this.w - 20
            icon.position.y = this.h / 2 - 1
            this.__icon = icon

            this.__iconColor = parameters.iconParams?.color
            this.__iconHoverColor = parameters.hoverIconParams?.color
            this.__iconPressColor = parameters.pressIconParams?.color
        }

        this.__textView!.position.x = this.w / 2
        this.__textView!.position.y = this.h / 2
        this.__hoverTextView!.position.x = this.w / 2
        this.__hoverTextView!.position.y = this.h / 2
        this.__pressTextView!.position.x = this.w / 2
        this.__pressTextView!.position.y = this.h / 2

        this.add(plane)
        this.add(this.__textView)
        this.__icon && this.add(this.__icon)

        this.__updateState()
    }

    protected onGlobalMouseMove(ev: Sky.MouseMoveEvent): void {
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

    protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
        if (ev.isCaptured) {
            return
        }

        if (this.__hovered) {
            this.__waitClick = true

            ev.isCaptured = true
        }

        this.__updateState()
    }

    protected onGlobalMouseUp(ev: Sky.MouseUpEvent): void {
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

    protected _updateZOrder(ev: Sky.UpdateZOrderEvent): void {
        if (this.__plane) {
            this.__plane.renderOrder = ev.z
            ++ev.z
        }

        if (this.__textView) {
            this.__textView.renderOrder = ev.z
        }

        this.__hoverTextView.renderOrder = ev.z
        this.__pressTextView.renderOrder = ev.z
        ++ev.z

        if (this.__icon) {
            this.__icon.view.renderOrder = ev.z
            ++ev.z
        }
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
                this.__plane.scale.set(
                    this.w + this.__pressStrokeWidth,
                    this.h + this.__pressStrokeWidth,
                    1
                )
                this.remove(this.__textView)
                this.remove(this.__hoverTextView)
                this.add(this.__pressTextView)
                this.__icon && this.__icon.applyColor(this.__iconPressColor!)
            } else {
                this.__material.map = this.__hoverTexture
                this.__plane.scale.set(
                    this.w + this.__hoverStrokeWidth,
                    this.h + this.__hoverStrokeWidth,
                    1
                )
                this.remove(this.__textView)
                this.add(this.__hoverTextView)
                this.remove(this.__pressTextView)
                this.__icon && this.__icon.applyColor(this.__iconHoverColor!)
            }
        } else {
            this.__material.map = this.__texture
            this.__plane.scale.set(this.w + this.__strokeWidth, this.h + this.__strokeWidth, 1)
            this.__plane.material = this.__material
            this.add(this.__textView)
            this.remove(this.__hoverTextView)
            this.remove(this.__pressTextView)
            this.__icon && this.__icon.applyColor(this.__iconColor!)
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
}
