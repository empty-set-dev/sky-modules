import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { gridRecipe } from './Grid.recipe.lite'

export default function Grid<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof gridRecipe>
): Mitosis.Node {
    const {
        columns,
        rows,
        gap,
        columnGap,
        rowGap,
        areas,
        autoFlow,
        autoColumns,
        autoRows,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        gridRecipe({
            columns,
            rows,
            gap,
            columnGap,
            rowGap,
            areas,
            autoFlow,
            autoColumns,
            autoRows,
        })
    const gridRef = useRef(null)
    return (
        <Box
            ref={gridRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}