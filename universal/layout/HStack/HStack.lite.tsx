import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { hstackRecipe } from './HStack.recipe.lite'

export type HStackProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof hstackRecipe> & {
    inputRef?: unknown
}

export default function HStack<T extends TagName = 'div'>(props: HStackProps<T>): Mitosis.Node {
    const { spacing, align, justify, wrap, reverse, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? hstackRecipe({ spacing, align, justify, wrap, reverse })
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}