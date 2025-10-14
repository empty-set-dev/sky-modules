import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { vstackRecipe } from './VStack.recipe.lite'

export type VStackProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof vstackRecipe> & {
    inputRef?: unknown
}

export default function VStack<T extends TagName = 'div'>(props: VStackProps<T>): Mitosis.Node {
    const { spacing, align, justify, wrap, reverse, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? vstackRecipe({ spacing, align, justify, wrap, reverse })
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