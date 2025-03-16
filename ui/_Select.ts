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
        optionsW!: number
        h!: number
        value?: T
        onChange?: (selected: T) => void

        constructor(deps: EffectDeps, params: SelectParams<T>) {
            super(deps, {
                ...params,
                w: params.w ?? 200,
                text: params.title,
                icon: '/lineicons5/svg/chevron-down.svg',
                iconParams: {
                    color: 0xffffff,
                    w: 20,
                },
                hoverIconParams: {
                    color: 0x000000,
                    w: 20,
                },
                pressIconParams: {
                    color: 0xffffff,
                    w: 20,
                },
            }) as never

            return asyncConstructor(this, Select.asyncConstructor2, params)
        }

        private static async asyncConstructor2<T>(
            this: Select<T>,
            params: SelectParams<T>
        ): Promise<void> {
            this.__opened = false
            this.__options = []

            this.optionsW = 200 - (params.radius ?? 16) * 2

            let y = 0

            for (const [i, optionData] of params.options.entries()) {
                const option = await new Select.Option<T>(this, {
                    select: this,
                    title: optionData.title,
                    value: optionData.value,
                    w: this.optionsW,
                    x: params.radius ?? 16,
                    y,
                    radius: i === params.options.length - 1 ? 16 : 0,
                    isLast: i === params.options.length - 1,
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
            } else {
                this.__opened = false
                this.__options.forEach(option => {
                    this.view.remove(option.view)
                    option.visible = false
                })
            }
        }

        globalMouseDown(ev: MouseDownEvent): void {
            super.globalMouseDown(ev)

            const h = this.__getOptionsH()

            if (
                this.__opened &&
                ((ev.y > 0 && (ev.x < 0 || ev.x > this.w || ev.y > this.h)) ||
                    (ev.y <= 0 &&
                        (ev.x < (this.w - this.optionsW) / 2 ||
                            ev.y < -h ||
                            ev.x > this.w / 2 + this.optionsW / 2)))
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
    }

    export namespace Select {
        export interface OptionParams<T> extends Omit<BaseButtonParams, 'text'> {
            select: Select<T>
            title: string
            value: T
            isLast: boolean
        }
        export class Option<T> extends BaseButton {
            select!: Select<T>
            value!: T

            constructor(deps: EffectDeps, params: OptionParams<T>) {
                super(deps, {
                    ...params,
                    text: params.title,
                    rounded: params.isLast ? 'bottom' : 'all',
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
