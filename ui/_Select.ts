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
            const promise: Promise<Select<T>> = super(deps, {
                ...params,
                w: params.w ?? 200,
                text: params.title,
            }) as never

            return asyncConstructor(async () => {
                const _this = await promise

                const arrowDownIcon = await new SvgView({
                    path: '/lineicons5/svg/chevron-down.svg',
                    color: 0xffffff,
                    w: 20,
                })
                const iconAabb = new Three.Box3()
                iconAabb.setFromObject(arrowDownIcon)
                arrowDownIcon.position.x = _this.w - 20
                arrowDownIcon.position.y = _this.h / 2 - 1
                this.__arrowDown = arrowDownIcon
                _this.view.add(arrowDownIcon)

                _this.__opened = false
                _this.__options = []

                let y = 0

                for (const optionData of params.options) {
                    const option = await new Select.Option<T>(_this, {
                        select: _this,
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

                    _this.__options.push(option)
                }

                return this
            })
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
                const promise: Promise<Option<T>> = super(deps, {
                    ...params,
                    text: params.title,
                }) as never

                return asyncConstructor(async () => {
                    const _this = await promise

                    _this.select = params.select
                    _this.value = params.value

                    return this
                })
            }

            _onClick(): void {
                this.select.value = this.value
                this.select['__close']()
            }
        }
    }
}

Object.assign(UI, lib)
