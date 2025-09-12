import { Children, cloneElement, HTMLElementType, Ref } from 'react'
import { cx } from 'sky/helpers/cn'
iAm('sky.react.components.layout.Box', import('./Box'))

declare global {
    interface Modules {
        'sky.react.components.layout.Box': typeof import('./Box')
    }
}

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
    className?: string
    sx?: string
    as?: keyof HTMLElementTagNameMap
    asChild?: boolean
    extends?: string
}
export default forwardRef(function Box<T extends keyof HTMLElementTagNameMap = 'div'>(
    props: BoxProps & { as?: T },
    ref: Ref<HTMLElementTagNameMap[T]>
): ReactNode {
    const { className, sx, as, asChild, children, ...restProps } = props
    const Tag: HTMLElementType = as ?? 'div'

    if (asChild) {
        return Children.map(children, child =>
            child != null
                ? //@ts-expect-error
                  cloneElement(child, {
                      ...restProps,
                      ref,
                      className: cx(className, sx),
                  })
                : child
        )
    }

    return (
        //@ts-expect-error
        <Tag ref={ref} {...restProps} className={cx(className, sx)}>
            {children}
        </Tag>
    )
})
