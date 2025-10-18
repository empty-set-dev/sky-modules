import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Link.lite.css'

import clsx from 'clsx'

import { linkRecipe } from './Link.recipe.lite'

export type LinkProps<T extends TagName = 'a'> = Design.SlotProps<typeof linkRecipe, T> & {
    inputRef?: unknown
}

export default function Link<T extends TagName = 'a'>(props: LinkProps<T>): Mitosis.Node {
    const { underline, subtle, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? linkRecipe({ underline, subtle })
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? ('a' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
