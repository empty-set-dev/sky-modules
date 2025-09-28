import JSX from './JSX'

export function jsx(type: string | Function, props: Record<string, unknown>): JSX.Element {
    const { children, ...restProps } = props || {}
    return {
        type,
        props: restProps,
        children: children ? (Array.isArray(children) ? children : [children]) : [],
    }
}
