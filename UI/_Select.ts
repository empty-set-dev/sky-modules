import globalify from 'sky/utilities/globalify'

import { BaseButton, BaseButtonParameters } from './__BaseButton'

declare global {
    namespace UI {
        type SelectParams<T> = lib.SelectParameters<T>

        namespace Select {
            type Option<T> = lib.Select.Option<T>
        }
        class Select<T> extends lib.Select<T> {}
    }
}

namespace lib {
    export interface SelectParameters<T> extends Omit<BaseButtonParameters, 'text'> {
        title: string
        options: {
            title: string
            value: T
        }[]
        value?: T
        onChange?: (selected: T) => void
    }
    export class Select<T> extends BaseButton {
        w!: number
        h!: number
        value?: T
        onChange?: (selected: T) => void

        constructor(deps: EffectDeps, params: SelectParameters<T>) {
            super(deps, {
                ...params,
                w: params.w ?? 200,
                text: params.title,
                icon: '/lineicons5/svg/chevron-down.svg',
                iconParams: {
                    color: params.textParams?.color ?? 0xffffff,
                    w: 20,
                },
                hoverIconParams: {
                    color: params.textParams?.color ?? 0x000000,
                    w: 20,
                },
                pressIconParams: {
                    color: params.textParams?.color ?? 0xffffff,
                    w: 20,
                },
            }) as never

            return asyncConstructor(this, Select.asyncConstructor2, params)
        }

        private static async asyncConstructor2<T>(
            this: Select<T>,
            params: SelectParameters<T>
        ): Promise<void> {
            const renderer = this.effect.context(Sky.Renderer)

            this.__isOpened = false
            this.__options = []

            this.__optionsW = 200 - (params.radius ?? 16) * 2

            let y = 0

            this.__optionsBufferScene = new Three.Scene()

            for (const [i, optionData] of params.options.entries()) {
                const option = new Select.Option<T>(this.effect, {
                    select: this,
                    title: optionData.title,
                    value: optionData.value,
                    w: this.__optionsW,
                    x: 0,
                    y,
                    radius: i === params.options.length - 1 ? 16 : 0,
                    isLast: i === params.options.length - 1,
                })

                await when(option)

                // TODO await option

                option.visible = false
                option.position.y -= option.h
                y -= option.h

                this.__options.push(option)
                this.__optionsBufferScene.add(option)
            }

            this.__optionsH = -y

            this.__optionsViewH = Math.min(this.__optionsH, 200)
            this.__optionsBufferCamera = new Three.OrthographicCamera(
                -1,
                this.__optionsW + 1,
                1,
                -this.__optionsViewH - 1
            )
            this.__optionsBufferCamera.position.z = 1
            this.__optionsBufferTexture = new Three.WebGLRenderTarget(
                (this.__optionsW + 2) * renderer.pixelRatio,
                (this.__optionsViewH + 2) * renderer.pixelRatio,
                {
                    minFilter: Three.NearestFilter,
                    magFilter: Three.NearestFilter,
                }
            )
            this.__renderOptions()

            this.__optionsView = new Three.Mesh(
                new Three.PlaneGeometry(this.__optionsW, this.__optionsViewH),
                new Three.MeshBasicMaterial({
                    map: this.__optionsBufferTexture.texture,
                    transparent: true,
                })
            )
            this.__optionsView.position.x = this.__optionsW / 2 + 1 + (params.radius ?? 16)
            this.__optionsView.position.y = -this.__optionsViewH / 2 + 1
        }

        protected onGlobalMouseDown(ev: Sky.MouseDownEvent): void {
            super.onGlobalMouseDown(ev)

            if (
                this.__isOpened &&
                ((ev.y > 0 && (ev.x < 0 || ev.x > this.w || ev.y > this.h)) ||
                    (ev.y <= 0 &&
                        (ev.x < (this.w - this.__optionsW) / 2 ||
                            ev.y < -this.__optionsH ||
                            ev.x > this.w / 2 + this.__optionsW / 2)))
            ) {
                this.__close()
            }
        }

        protected update(): void {
            if (this.__isOpened) {
                this.__renderOptions()
            }
        }

        protected _onClick(): void {
            if (!this.__isOpened) {
                this.__open()
            } else {
                this.__close()
            }
        }

        private __renderOptions(): void {
            const renderer = this.effect.context(Sky.Renderer)
            renderer.setRenderTarget(this.__optionsBufferTexture)
            const lastClearColor = new Three.Color()
            renderer.getClearColor(lastClearColor)
            const lastClearAlpha = renderer.getClearAlpha()
            renderer.setClearColor(0x000000, 0)
            renderer.clear(true)
            renderer.render(this.__optionsBufferScene, this.__optionsBufferCamera)
            renderer.setRenderTarget(null)
            renderer.setClearColor(lastClearColor, lastClearAlpha)
        }

        private __open(): void {
            this.__isOpened = true
            this.add(this.__optionsView)
            this.__options.forEach(option => {
                option.visible = true
            })
        }

        private __close(): void {
            this.__isOpened = false
            this.remove(this.__optionsView)
            this.__options.forEach(option => {
                option.visible = false
            })
        }

        private __isOpened!: boolean
        private __options!: Select.Option<T>[]
        private __optionsW!: number
        private __optionsH!: number
        private __optionsView!: Three.Mesh
        private __optionsViewH!: number
        private __optionsBufferScene!: Three.Scene
        private __optionsBufferCamera!: Three.OrthographicCamera
        private __optionsBufferTexture!: Three.WebGLRenderTarget<Three.Texture>
    }

    export namespace Select {
        export interface OptionParameters<T> extends Omit<BaseButtonParameters, 'text'> {
            select: Select<T>
            title: string
            value: T
            isLast: boolean
        }
        export class Option<T> extends BaseButton {
            select!: Select<T>
            value!: T

            constructor(deps: EffectDeps, params: OptionParameters<T>) {
                super(deps, {
                    ...params,
                    text: params.title,
                    rounded: params.isLast ? 'bottom' : 'all',
                })

                return asyncConstructor(this, Option.asyncConstructor2, params)
            }

            private static async asyncConstructor2<T>(
                this: Option<T>,
                params: OptionParameters<T>
            ): Promise<void> {
                this.select = params.select
                this.value = params.value
            }

            _onClick(): void {
                this.select.value = this.value
                this.select['__close']()
            }
        }
    }
}

globalify.namespace('UI', lib)
