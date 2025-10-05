'use client'
import clsx from 'clsx'
import * as React from 'react'
import { useRef } from 'react'

import { flexRecipe } from './Flex.recipe.js'

function Flex(props: Design.SlotProps<T, typeof flexRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
    const direction = props.direction
    const wrap = props.wrap
    const align = props.align
    const justify = props.justify
    const gap = props.gap
    const grow = props.grow
    const shrink = props.shrink
    const basis = props.basis
    const unstyled = props.unstyled
    const recipe = props.recipe
    const as = props.as
    const restProps = (({
        direction,
        wrap,
        align,
        justify,
        gap,
        grow,
        shrink,
        basis,
        unstyled,
        recipe,
        as,
        ...rest
    }) => rest)(props)
    const styles =
        recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis })

    const flexRef = useRef(null)

    return (
        <Box
            ref={flexRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}

export default Flex
