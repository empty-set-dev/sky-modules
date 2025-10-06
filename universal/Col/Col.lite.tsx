import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { colRecipe } from './Col.recipe.lite'

export default function Col<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof colRecipe>
): Mitosis.Node {
    const {
        span,
        offset,
        order,
        flex,
        push,
        pull,
        xs,
        sm,
        md,
        lg,
        xl,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        colRecipe({
            span,
            offset,
            order,
            flex,
            push,
            pull,
            xs,
            sm,
            md,
            lg,
            xl,
        })
    const colRef = useRef(null)
    return (
        <Box
            ref={colRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}