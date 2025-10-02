import { recipe } from '@sky-modules/design/recipe';
export const columnRecipe = recipe({
  base: 'column',
  variants: {
    span: {
      1: 'column--span-1',
      2: 'column--span-2',
      3: 'column--span-3',
      4: 'column--span-4',
      5: 'column--span-5',
      6: 'column--span-6',
      7: 'column--span-7',
      8: 'column--span-8',
      9: 'column--span-9',
      10: 'column--span-10',
      11: 'column--span-11',
      12: 'column--span-12',
      auto: 'column--span-auto'
    },
    offset: {
      0: 'column--offset-0',
      1: 'column--offset-1',
      2: 'column--offset-2',
      3: 'column--offset-3',
      4: 'column--offset-4',
      5: 'column--offset-5',
      6: 'column--offset-6',
      7: 'column--offset-7',
      8: 'column--offset-8',
      9: 'column--offset-9',
      10: 'column--offset-10',
      11: 'column--offset-11'
    },
    order: {
      first: 'column--order-first',
      last: 'column--order-last',
      1: 'column--order-1',
      2: 'column--order-2',
      3: 'column--order-3',
      4: 'column--order-4',
      5: 'column--order-5',
      6: 'column--order-6',
      7: 'column--order-7',
      8: 'column--order-8',
      9: 'column--order-9',
      10: 'column--order-10',
      11: 'column--order-11',
      12: 'column--order-12'
    },
    flex: {
      auto: 'column--flex-auto',
      initial: 'column--flex-initial',
      none: 'column--flex-none',
      1: 'column--flex-1'
    },
    push: {
      1: 'column--push-1',
      2: 'column--push-2',
      3: 'column--push-3',
      4: 'column--push-4',
      5: 'column--push-5',
      6: 'column--push-6'
    },
    pull: {
      1: 'column--pull-1',
      2: 'column--pull-2',
      3: 'column--pull-3',
      4: 'column--pull-4',
      5: 'column--pull-5',
      6: 'column--pull-6'
    },
    xs: {
      1: 'column--xs-1',
      2: 'column--xs-2',
      3: 'column--xs-3',
      4: 'column--xs-4',
      5: 'column--xs-5',
      6: 'column--xs-6',
      12: 'column--xs-12'
    },
    sm: {
      1: 'column--sm-1',
      2: 'column--sm-2',
      3: 'column--sm-3',
      4: 'column--sm-4',
      6: 'column--sm-6',
      12: 'column--sm-12'
    },
    md: {
      1: 'column--md-1',
      2: 'column--md-2',
      3: 'column--md-3',
      4: 'column--md-4',
      6: 'column--md-6',
      8: 'column--md-8',
      12: 'column--md-12'
    },
    lg: {
      1: 'column--lg-1',
      2: 'column--lg-2',
      3: 'column--lg-3',
      4: 'column--lg-4',
      6: 'column--lg-6',
      8: 'column--lg-8',
      9: 'column--lg-9',
      12: 'column--lg-12'
    },
    xl: {
      1: 'column--xl-1',
      2: 'column--xl-2',
      3: 'column--xl-3',
      4: 'column--xl-4',
      6: 'column--xl-6',
      8: 'column--xl-8',
      12: 'column--xl-12'
    }
  },
  defaultVariants: {
    span: 'auto',
    flex: 'initial'
  }
})