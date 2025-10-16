import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { buttonRecipe } from './Button.recipe.lite'

export type ButtonProps<T extends BoxAs = 'button'> = Design.SlotRootProps<
    typeof buttonRecipe,
    T
> & {
    inputRef?: unknown
    spinnerPlacement?: 'start' | 'end' | undefined
    colorPalette?:
        | 'gray'
        | 'red'
        | 'orange'
        | 'yellow'
        | 'green'
        | 'teal'
        | 'blue'
        | 'cyan'
        | 'purple'
        | 'pink'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
    variant?: 'solid' | 'subtle' | 'surface' | 'outline' | 'ghost' | 'plain'
    loading?: boolean
    loadingText?: Mitosis.Node
    spinner?: Mitosis.Node
    highContrast?: boolean
    rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    disabled?: boolean
    brand?: boolean
    primary?: boolean
    secondary?: boolean
    tertiary?: boolean
}

export default function Button<T extends BoxAs = 'button'>(props: ButtonProps<T>): Mitosis.Node {
    const {
        colorPalette,
        size,
        variant,
        loading,
        loadingText,
        spinner,
        highContrast,
        rounded,
        disabled,
        brand,
        primary,
        secondary,
        tertiary,

        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        unstyled ||
        (recipe ??
            buttonRecipe({
                colorPalette,
                size,
                variant,
                loading,
                highContrast,
                rounded,
                disabled,
                brand,
                primary,
                secondary,
                tertiary,
            }))
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? 'button'}
            disabled={disabled}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {loading && <span className="button__loading">⏳</span>}
            {props.children}
        </Box>
    )
}
