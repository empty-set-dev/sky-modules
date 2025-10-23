import { recipe } from '@sky-modules/design/recipe';
export const colRecipe = recipe({
  base: 'col',
  variants: {
    span: {
      1: 'col--span-1',
      2: 'col--span-2',
      3: 'col--span-3',
      4: 'col--span-4',
      5: 'col--span-5',
      6: 'col--span-6',
      7: 'col--span-7',
      8: 'col--span-8',
      9: 'col--span-9',
      10: 'col--span-10',
      11: 'col--span-11',
      12: 'col--span-12',
      auto: 'col--span-auto'
    },
    offset: {
      0: 'col--offset-0',
      1: 'col--offset-1',
      2: 'col--offset-2',
      3: 'col--offset-3',
      4: 'col--offset-4',
      5: 'col--offset-5',
      6: 'col--offset-6',
      7: 'col--offset-7',
      8: 'col--offset-8',
      9: 'col--offset-9',
      10: 'col--offset-10',
      11: 'col--offset-11'
    },
    push: {
      1: 'col--push-1',
      2: 'col--push-2',
      3: 'col--push-3',
      4: 'col--push-4',
      5: 'col--push-5',
      6: 'col--push-6'
    },
    pull: {
      1: 'col--pull-1',
      2: 'col--pull-2',
      3: 'col--pull-3',
      4: 'col--pull-4',
      5: 'col--pull-5',
      6: 'col--pull-6'
    },
    xs: {
      1: 'col--xs-1',
      2: 'col--xs-2',
      3: 'col--xs-3',
      4: 'col--xs-4',
      5: 'col--xs-5',
      6: 'col--xs-6',
      12: 'col--xs-12'
    },
    sm: {
      1: 'col--sm-1',
      2: 'col--sm-2',
      3: 'col--sm-3',
      4: 'col--sm-4',
      6: 'col--sm-6',
      12: 'col--sm-12'
    },
    md: {
      1: 'col--md-1',
      2: 'col--md-2',
      3: 'col--md-3',
      4: 'col--md-4',
      6: 'col--md-6',
      8: 'col--md-8',
      12: 'col--md-12'
    },
    lg: {
      1: 'col--lg-1',
      2: 'col--lg-2',
      3: 'col--lg-3',
      4: 'col--lg-4',
      6: 'col--lg-6',
      8: 'col--lg-8',
      9: 'col--lg-9',
      12: 'col--lg-12'
    },
    xl: {
      1: 'col--xl-1',
      2: 'col--xl-2',
      3: 'col--xl-3',
      4: 'col--xl-4',
      6: 'col--xl-6',
      8: 'col--xl-8',
      12: 'col--xl-12'
    }
  },
  defaultVariants: {
    span: 'auto',
    flex: 'initial'
  }
})