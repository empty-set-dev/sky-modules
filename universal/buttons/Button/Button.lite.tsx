import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { buttonRecipe } from './Button.recipe.lite'

export type ButtonProps<T extends BoxAs = 'button'> = Design.SlotProps<T, typeof buttonRecipe> & {
    inputRef?: unknown
}

export default function Button<T extends BoxAs = 'button'>(props: ButtonProps<T>): Mitosis.Node {
    const { variant, size, disabled, loading, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? buttonRecipe({ variant, size, disabled, loading })
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
