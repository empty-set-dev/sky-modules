import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { aspectRatioRecipe } from './AspectRatio.recipe.lite'

export type AspectRatioProps<T extends BoxAs = 'div'> = Design.SlotProps<
    T,
    typeof aspectRatioRecipe
> & {
    inputRef?: unknown
    ratio?: number
}

export default function AspectRatio<T extends BoxAs = 'div'>(
    props: AspectRatioProps<T>
): Mitosis.Node {
    const {
        ratio,

        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles = recipe ?? aspectRatioRecipe({})
    const rootStyles = styles.root?(props)
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? 'div'}
            sx={clsx(props.sx, unstyled || rootStyles)}
        >
            <Box></Box>
            {props.children}
        </Box>
    )
}
