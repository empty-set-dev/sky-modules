import { recipe } from '@sky-modules/design/recipe'

export const linkRecipe = recipe({
    base: 'link',
    variants: {
        underline: {
            true: 'link--underline',
        },
        subtle: {
            true: 'link--subtle',
        },
    },
})
