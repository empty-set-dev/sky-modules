import { recipe } from '@sky-modules/design/recipe';
export const bleedRecipe = recipe({
  base: 'bleed',
  variants: {
    hasInline: {
      true: 'bleed--inline'
    },
    hasBlock: {
      true: 'bleed--block'
    },
    hasInlineStart: {
      true: 'bleed--inline-start'
    },
    hasInlineEnd: {
      true: 'bleed--inline-end'
    },
    hasBlockStart: {
      true: 'bleed--block-start'
    },
    hasBlockEnd: {
      true: 'bleed--block-end'
    }
  }
})