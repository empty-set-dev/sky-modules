import {
    component$,
    Slot,
    type QwikIntrinsicElements,
    type JSXOutput,
    type QRL,
} from '@builder.io/qwik'
import clsx from 'clsx'

type SxProps = string | string[] | Record<string, boolean>

// Base Box props
type BoxOwnProps = {
    sx?: SxProps
    class?: string
}

// HTML element props
type BoxElementProps<T extends keyof QwikIntrinsicElements = 'div'> = BoxOwnProps &
    Omit<QwikIntrinsicElements[T], 'class'> & { as?: T }

// Function component props - supports both regular functions and QRL
type BoxComponentProps<P = Record<string, unknown>> = BoxOwnProps &
    P & { as: ((props: P) => JSXOutput) | QRL<(props: P) => JSXOutput> }

// Polymorphic Box interface with overloads
interface BoxType {
    <T extends keyof QwikIntrinsicElements = 'div'>(props: BoxElementProps<T>): JSXOutput
    <P extends Record<string, unknown>>(props: BoxComponentProps<P>): JSXOutput
}

export default component$((props: BoxElementProps | BoxComponentProps) => {
    const { as: Element = 'div', sx, class: className, ...restProps } = props
    const combinedClass = clsx(className, sx)

    const elementProps = {
        ...restProps,
        class: combinedClass,
    }

    // Element can be a string (HTML tag), function or QRL
    // Qwik will handle all variants correctly
    return (
        // @ts-expect-error - dynamic element
        <Element {...elementProps}>
            <Slot />
        </Element>
    )
}) as BoxType
