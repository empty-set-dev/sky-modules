import { cva } from 'class-variance-authority'
import { cx } from 'sky/helpers/cn'
import { Props as TailwindProps, Box as TailwindBox } from 'tailwind-props'
iAm('Box', import('./Box'))

declare global {
    interface Modules {
        Box: typeof import('./Box')
    }
}

const button = cva(['font-semibold', 'border', 'rounded'], {
    variants: {
        intent: {
            primary: `
                bg-blue-500
                text-white
                border-transparent
            `,
            // **or**
            // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: `
                bg-white
                text-gray-800
                border-gray-400`,
        },
        size: {
            small: ['text-sm', 'py-1', 'px-2'],
            medium: ['text-base', 'py-2', 'px-4'],
        },
        // `boolean` variants are also supported!
        disabled: {
            false: null,
            true: ['opacity-50', 'cursor-not-allowed'],
        },
    },
    compoundVariants: [
        {
            intent: 'primary',
            disabled: false,
            className: 'hover:bg-blue-600',
        },
        {
            intent: 'secondary',
            disabled: false,
            className: 'hover:bg-gray-100',
        },
        {
            intent: 'primary',
            size: 'medium',
            // **or** if you're a React.js user, `className` may feel more consistent:
            className: 'uppercase',
        },
    ],
    defaultVariants: {
        intent: 'primary',
        size: 'medium',
        disabled: false,
    },
})

export interface BoxProps extends PropsWithChildren, TailwindProps {
    className?: string
    sx?: string
}
export default function Box(props: BoxProps): ReactNode {
    const { sx, ...restProps } = props

    console.log(restProps)

    return (
        <TailwindBox {...restProps} className={cx(restProps.className, sx)}>
            Hello, world!
        </TailwindBox>
    )
}
