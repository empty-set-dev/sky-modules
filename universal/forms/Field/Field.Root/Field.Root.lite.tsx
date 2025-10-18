import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Field.Root.lite.css'

import clsx from 'clsx'

import { fieldRootRecipe } from './Field.Root.recipe.lite'

export type FieldRootProps<T extends BoxAs = 'div'> = Design.SlotRootProps<
    typeof fieldRootRecipe,
    T
> & {
    inputRef?: unknown
    required?: boolean
    invalid?: boolean
    disabled?: boolean
    readOnly?: boolean
}

export default function FieldRoot<T extends BoxAs = 'div'>(
    props: FieldRootProps<T>
): Mitosis.Node {
    const { required, invalid, disabled, readOnly, inputRef, unstyled, recipe, sx, ...boxProps } =
        props

    const styles =
        unstyled || (recipe ?? fieldRootRecipe({ required, invalid, disabled, readOnly }))

    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
