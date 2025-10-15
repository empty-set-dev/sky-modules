import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { bleedRecipe } from './Bleed.recipe.lite'
import './Bleed.lite.css'

export type BleedProps<T extends BoxAs = 'div'> = Design.SlotRootProps<T> & {
    inline?: string | number
    block?: string | number
    inlineStart?: string | number
    inlineEnd?: string | number
    blockStart?: string | number
    blockEnd?: string | number
    //
    inputRef?: unknown
}

export default function Bleed<T extends BoxAs = 'div'>(props: BleedProps<T>): Mitosis.Node {
    const {
        inline: inlineProp,
        block: blockProp,
        inlineStart,
        inlineEnd,
        blockStart,
        blockEnd,
        //
        children,
        inputRef,
        unstyled,
        recipe,
        as = 'div',
        ...boxProps
    } = props

    const styles =
        recipe ??
        bleedRecipe({
            hasInline: !!inlineProp,
            hasBlock: !!blockProp,
            hasInlineStart: !!inlineStart,
            hasInlineEnd: !!inlineEnd,
            hasBlockStart: !!blockStart,
            hasBlockEnd: !!blockEnd,
        })

    function formatValue(value: string | number): string {
        if (typeof value === 'number') {
            return `${value}px`
        }

        return value
    }

    const cssVariables = {
        ...(inlineProp && {
            '--bleed-inline-start': `calc(-1 * ${formatValue(inlineProp)})`,
            '--bleed-inline-end': `calc(-1 * ${formatValue(inlineProp)})`,
        }),
        ...(blockProp && {
            '--bleed-block-start': `calc(-1 * ${formatValue(blockProp)})`,
            '--bleed-block-end': `calc(-1 * ${formatValue(blockProp)})`,
        }),
        ...(inlineStart && { '--bleed-inline-start': `calc(-1 * ${formatValue(inlineStart)})` }),
        ...(inlineEnd && { '--bleed-inline-end': `calc(-1 * ${formatValue(inlineEnd)})` }),
        ...(blockStart && { '--bleed-block-start': `calc(-1 * ${formatValue(blockStart)})` }),
        ...(blockEnd && { '--bleed-block-end': `calc(-1 * ${formatValue(blockEnd)})` }),
    }

    return (
        <Box
            ref={inputRef}
            as={as}
            sx={clsx(props.sx, unstyled || (recipe ?? styles))}
            style={{ ...props.style, ...cssVariables }}
            {...boxProps}
        >
            {children}
        </Box>
    )
}
