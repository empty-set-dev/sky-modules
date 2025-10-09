import { recipe } from '@sky-modules/design/recipe';
export const layoutRecipe = recipe({
  base: 'layout',
  variants: {
    variant: {
      basic: 'layout--basic',
      sidebar: 'layout--sidebar',
      'sidebar-right': 'layout--sidebar-right',
      'three-column': 'layout--three-column',
      header: 'layout--header',
      'header-footer': 'layout--header-footer',
      dashboard: 'layout--dashboard'
    },
    header: {
      true: 'layout--with-header'
    },
    footer: {
      true: 'layout--with-footer'
    },
    sidebar: {
      true: 'layout--with-sidebar',
      left: 'layout--sidebar-left',
      right: 'layout--sidebar-right'
    },
    aside: {
      true: 'layout--with-aside'
    },
    fullHeight: {
      true: 'layout--full-height'
    }
  },
  defaultVariants: {
    variant: 'basic',
    fullHeight: true
  }
})