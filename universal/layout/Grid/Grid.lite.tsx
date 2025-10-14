import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { gridRecipe } from './Grid.recipe.lite'

export type GridProps<T extends BoxAs = 'div'> = Design.SlotProps<T, typeof gridRecipe> & {
    inputRef?: unknown
}

export default function Grid<T extends BoxAs = 'div'>(props: GridProps<T>): Mitosis.Node {
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
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? 'div'}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
