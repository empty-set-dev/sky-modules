import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { linkRecipe } from './Link.recipe.lite'

export default function Link<T extends TagName = 'a'>(
    props: Design.SlotProps<T, typeof linkRecipe>
): Mitosis.Node {
    const { underline, subtle, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? linkRecipe({ underline, subtle })
    const inputRef = useRef(null)
    return (
        <Box
            ref={inputRef}
            {...restProps}
            as={as ?? ('a' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}

//
