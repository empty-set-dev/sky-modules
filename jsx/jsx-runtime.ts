import JSX from '.'

export function jsx(type: string | Function, props: Record<string, unknown>): JSX.Element {
    return {
        type,
        props,
        children: props.children
            ? Array.isArray(props.children)
                ? props.children
                : [props.children]
            : [],
        key: '',
    }
}

export const Fragment = 'Fragment'
