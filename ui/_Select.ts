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
            // @ts-ignore
            const promise = super(deps, {
                ...params,
                text: params.title,
            })

            return asyncConstructor(async () => {
                await promise

                params.options.forEach(optionData => {
                    const option = new Select.Option<T>(this, {
                        title: optionData.title,
                        value: optionData.value,
                        w: 200,
                        x: 0,
                        y: 0,
                    })

                    this.__options.push(option)
                    this.view.add(option.view)
                })

                return this
            })
        }

        private __options: Select.Option<T>[] = []
    }

    export namespace Select {
        export interface OptionParams<T> extends Omit<BaseButtonParams, 'text'> {
            title: string
            value: T
        }
        export class Option<T> extends BaseButton {
            value: T

            constructor(deps: EffectDeps, params: OptionParams<T>) {
                const promise = super(deps, {
                    ...params,
                    text: params.title,
                })

                this.value = params.value

                return asyncConstructor(async () => {
                    await promise

                    return this
                })
            }
        }
    }
}

Object.assign(UI, lib)
