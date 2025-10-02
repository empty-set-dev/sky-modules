import { recipe } from '@sky-modules/design/recipe'

export const layoutRootRecipe = recipe({
    base: 'layout-root',
    variants: {
        variant: {
            default: 'layout-root--default',
            app: 'layout-root--app',
            page: 'layout-root--page',
            dashboard: 'layout-root--dashboard',
            landing: 'layout-root--landing',
        },
        fullHeight: {
            true: 'layout-root--full-height',
            screen: 'layout-root--screen-height',
            viewport: 'layout-root--viewport-height',
        },
        fullWidth: {
            true: 'layout-root--full-width',
        },
        overflow: {
            visible: 'layout-root--overflow-visible',
            hidden: 'layout-root--overflow-hidden',
            scroll: 'layout-root--overflow-scroll',
            auto: 'layout-root--overflow-auto',
        },
        direction: {
            row: 'layout-root--direction-row',
            column: 'layout-root--direction-column',
        },
    },
    defaultVariants: {
        variant: 'default',
        fullHeight: true,
        fullWidth: true,
        overflow: 'hidden',
        direction: 'column',
    },
})