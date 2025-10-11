import JSX from '.'

export function jsxDEV(type: string | Function, props: Record<string, unknown>): JSX.Element {
    return {
        type,
        props,
        key: '',
    }
}

export const Fragment = 'Fragment'
