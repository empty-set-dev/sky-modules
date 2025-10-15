import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { $MITOSIS_COMPONENT_RECIPE } from './{{MITOSIS_COMPONENT}}.recipe.lite'

export type $MITOSIS_COMPONENTProps<T extends BoxAs = 'div'> = Design.SlotRootProps<
    T,
    typeof $MITOSIS_COMPONENT_RECIPE
> & {
    inputRef?: unknown
}

export default function $MITOSIS_COMPONENT<T extends BoxAs = 'div'>(
    props: $MITOSIS_COMPONENTProps<T>
): Mitosis.Node {
    const {
        //
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles = recipe ?? $MITOSIS_COMPONENTRecipe()
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
