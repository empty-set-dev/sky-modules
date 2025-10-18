import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Button.lite.css'

import clsx from 'clsx'

import { buttonRecipe } from './Button.recipe.lite'

export type ButtonProps<T extends BoxAs = 'button'> = Design.SlotRootProps<
    typeof buttonRecipe,
    T
> & {
    inputRef?: unknown
    spinnerPlacement?: 'start' | 'end' | undefined
    loadingText?: Mitosis.Node
    spinner?: Mitosis.Node
}

export default function Button<T extends BoxAs = 'button'>(props: ButtonProps<T>): Mitosis.Node {
    const {
        spinnerPlacement,
        loadingText,
        spinner,

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

        inputRef,
        unstyled,
        recipe,
        as,
        sx,
        ...restProps
    } = props
    const styles =
        unstyled ||
        (recipe ??
            buttonRecipe({
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
            ref={inputRef}
            {...restProps}
            as={as ?? 'button'}
            disabled={disabled}
            sx={clsx(sx, styles)}
            data-color-palette={colorPalette}
        >
            {loading && <span className="button__loading">⏳</span>}
            {props.children}
        </Box>
    )
}
