import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Field.ErrorText.lite.css'

import clsx from 'clsx'

import { fieldErrorTextRecipe } from './Field.ErrorText.recipe.lite'

export type FieldErrorTextProps<T extends BoxAs = 'div'> = Design.SlotRootProps<
    typeof fieldErrorTextRecipe,
    T
> & {
    inputRef?: unknown
}

export default function FieldErrorText<T extends BoxAs = 'div'>(
    props: FieldErrorTextProps<T>
): Mitosis.Node {
    const { inputRef, unstyled, recipe, sx, ...boxProps } = props

    const styles = unstyled || (recipe ?? fieldErrorTextRecipe({}))

    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
