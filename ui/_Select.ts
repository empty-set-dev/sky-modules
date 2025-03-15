import SvgView from 'sky/views/SvgView'

import { BaseButton, BaseButtonParams } from './_BaseButton'

declare global {
    namespace UI {
        type SelectParams<T> = lib.SelectParams<T>

        namespace Select {
            type Option<T> = lib.Select.Option<T>
        }
        type Select<T> = lib.Select<T>
        const Select: typeof lib.Select
    }
}

namespace lib {
    export interface SelectParams<T> extends Omit<BaseButtonParams, 'text'> {
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

        constructor(deps: EffectDeps, params: SelectParams<T>) {
            super(deps, {
                ...params,
                w: params.w ?? 200,
                text: params.title,
            }) as never

            return asyncConstructor(this, Select.asyncConstructor2, params)
        }

        private static async asyncConstructor2<T>(
            this: Select<T>,
            params: SelectParams<T>
        ): Promise<void> {
            const arrowDownIcon = await new SvgView({
                path: '/lineicons5/svg/chevron-down.svg',
                color: 0xffffff,
                h: 12,
            })
            arrowDownIcon.position.x = this.w - 20
            arrowDownIcon.position.y = this.h / 2 - 1
            this.__arrowDown = arrowDownIcon
            this.view.add(arrowDownIcon)

            this.__opened = false
            this.__options = []

            let y = 0

            for (const optionData of params.options) {
                const option = await new Select.Option<T>(this, {
                    select: this,
                    title: optionData.title,
                    value: optionData.value,
                    w: 200,
                    x: 0,
                    y,
                    radius: 0,
                })

                option.visible = false
                option.view.position.y -= option.h
                y -= option.h

                this.__options.push(option)
            }
        }

        _onClick(): void {
            if (!this.__opened) {
                this.__opened = true
                this.__options.forEach(option => {
                    this.view.add(option.view)
                    option.visible = true
                })
            }
        }

        globalMouseDown(ev: MouseDownEvent): void {
            super.globalMouseDown(ev)

            const h = this.__getOptionsH()

            if (
                this.__opened &&
                (ev.x < this.view.position.x ||
                    ev.y < this.view.position.y - h ||
                    ev.x > this.view.position.x + this.w ||
                    ev.y > this.view.position.y + this.h)
            ) {
                this.__close()
            }
        }

        private __getOptionsH(): number {
            let h = this.h
            this.__options.forEach(option => {
                h += option.h
            })
            return h
        }

        private __close(): void {
            this.__opened = false
            this.__options.forEach(option => {
                this.view.remove(option.view)
                option.visible = false
            })
        }

        private __opened!: boolean
        private __options!: Select.Option<T>[]
        private __arrowDown!: Three.Object3D
        private __hoverArrowDown!: Three.Object3D
        private __pressArrowDown!: Three.Object3D
    }

    export namespace Select {
        export interface OptionParams<T> extends Omit<BaseButtonParams, 'text'> {
            select: Select<T>
            title: string
            value: T
        }
        export class Option<T> extends BaseButton {
            select!: Select<T>
            value!: T

            constructor(deps: EffectDeps, params: OptionParams<T>) {
                super(deps, {
                    ...params,
                    text: params.title,
                })

                return asyncConstructor(this, Option.asyncConstructor2, params)
            }

            private static async asyncConstructor2<T>(
                this: Option<T>,
                params: OptionParams<T>
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

Object.assign(UI, lib)
