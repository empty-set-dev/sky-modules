import JSX from '.'

export function jsxDEV(type: string | Function, props: Record<string, unknown>): JSX.Element {
    const { children, ...restProps } = props || {}
    return {
        type,
        props: restProps,
        children: children ? (Array.isArray(children) ? children : [children]) : [],
    }
}

export const Fragment = 'Fragment'
