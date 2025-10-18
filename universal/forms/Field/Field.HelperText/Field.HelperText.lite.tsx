import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Field.HelperText.lite.css'

import clsx from 'clsx'

import { fieldHelperTextRecipe } from './Field.HelperText.recipe.lite'

export type FieldHelperTextProps<T extends BoxAs = 'div'> = Design.SlotRootProps<
    typeof fieldHelperTextRecipe,
    T
> & {
    inputRef?: unknown
}

export default function FieldHelperText<T extends BoxAs = 'div'>(
    props: FieldHelperTextProps<T>
): Mitosis.Node {
    const { inputRef, unstyled, recipe, sx, ...boxProps } = props

    const styles = unstyled || (recipe ?? fieldHelperTextRecipe({}))

    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
