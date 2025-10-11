import JSX from '.'

export function jsx(type: string | Function, props: Record<string, unknown>): JSX.Element {
    return {
        type,
        props,
        key: '',
    }
}

export const Fragment = 'Fragment'
