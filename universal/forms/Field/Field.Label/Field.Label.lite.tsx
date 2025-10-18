import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Field.Label.lite.css'

import clsx from 'clsx'

import { fieldLabelRecipe } from './Field.Label.recipe.lite'

export type FieldLabelProps<T extends BoxAs = 'label'> = Design.SlotRootProps<
    typeof fieldLabelRecipe,
    T
> & {
    inputRef?: unknown
}
export default function FieldLabel<T extends BoxAs = 'label'>(
    props: FieldLabelProps<T>
): Mitosis.Node {
    const { inputRef, unstyled, recipe, sx, ...boxProps } = props

    const styles = unstyled || (recipe ?? fieldLabelRecipe())

    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
