import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Button.css'

import Mitosis from '@sky-modules/universal/Mitosis'
import clsx from 'clsx'

import { buttonRecipe } from './Button.recipe.lite'

/**
 * Props for Button component
 *
 * @template T - Element type (default: 'button')
 */
export type ButtonProps<T extends BoxAs = 'button'> = Design.SlotRootProps<
    typeof buttonRecipe,
    T
> & {
    /** Ref to the button element */
    inputRef?: unknown
    /** Loading spinner placement */
    spinnerPlacement?: 'start' | 'end' | undefined
    /** Text to show while loading */
    loadingText?: Mitosis.Node
    /** Custom spinner component */
    spinner?: Mitosis.Node
}

/**
 * Button component with Panda CSS styling
 *
 * Polymorphic button component that can render as any HTML element.
 * Supports loading states, variants, sizes, and color palettes.
 *
 * Compiled to all frameworks via Mitosis.
 *
 * @template T - Element type (default: 'button')
 * @param props - Component props
 * @returns Mitosis node
 *
 * @example Basic usage
 * ```tsx
 * import Button from '@sky-modules/universal/buttons/Button'
 *
 * <Button>Click me</Button>
 * ```
 *
 * @example With variants
 * ```tsx
 * <Button variant="solid" size="lg" colorPalette="blue">
 *   Large Button
 * </Button>
 * ```
 *
 * @example Loading state
 * ```tsx
 * <Button loading loadingText="Saving...">
 *   Save
 * </Button>
 * ```
 *
 * @example Polymorphic (as link)
 * ```tsx
 * <Button as="a" href="/home">
 *   Go Home
 * </Button>
 * ```
 *
 * @example Global usage
 * ```tsx
 * import '@sky-modules/universal/buttons/Button/global'
 *
 * <Button>Available globally</Button>
 * ```
 */
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
