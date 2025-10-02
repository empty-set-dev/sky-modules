'use client'
import clsx from 'clsx'
import * as React from 'react'
import { useRef } from 'react'

import { linkRecipe } from './Link.recipe.js'

function Link<T>(props: Design.SlotProps<T, typeof linkRecipe>) {
    // Preserved local variables (added by local-vars-plugin)
    const restProps = (({ underline, subtle, unstyled, recipe, as, ...rest }) => rest)(props)
    const as = props.as
    const unstyled = props.unstyled
    const styles = props.recipe ?? linkRecipe({ underline: props.underline, subtle: props.subtle })

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

export default Link
