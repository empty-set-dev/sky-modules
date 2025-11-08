import { recipe } from '@sky-modules/design/recipe';
export const buttonRecipe = recipe({
  base: ['button', `
            inline-flex items-center justify-center
            font-medium rounded-interactive
            border
            duration-base
            cursor-pointer
            border-none

            transform transition-transform

            focus:outline-none
            focus:border-focus
            focus:shadow-[var(--effects-glow-focus)]

            hover:[transform:var(--motion-button-hover)]
            active:[transform:var(--motion-button-active)]

            disabled:cursor-not-allowed
            disabled:opacity-disabled
            disabled:pointer-events-none
        `],
  variants: {
    size: {
      xs: ['button-xs', `
                    px-sm py-xs
                    label-medium min-h-sm
                `],
      sm: ['button--sm', `
                    px-sm py-xs
                    label-medium min-h-sm
                `],
      md: ['button--md', `
                    px-md py-sm
                    body-medium min-h-md
                `],
      lg: ['button--lg', `
                    px-lg py-md
                    title-small min-h-lg
                `],
      xl: ['button--xl', `
                    px-xl py-lg
                    title-medium min-h-xl
                `],
      '2xl': ['button--2xl', `
                    px-2xl py-xl
                    title-large min-h-2xl
                `],
      '3xl': ['button--3xl', `
                    px-3xl py-2xl
                    headline-small min-h-3xl
                `]
    },
    variant: {
      solid: ['button--solid', `
                    bg-transparent text-brand-primary-hover
                `],
      subtle: ['button--subtle', `
                    bg-transparent text-brand-primary-hover
                `],
      surface: ['button--surface', `
                    bg-transparent text-brand-primary-hover
                `],
      outline: ['button--outline', `
                    bg-transparent text-brand-primary-hover
                    border-brand-primary-hover
                    hover:bg-brand-primary-hover hover:text-inverse
                    hover:shadow-[var(--effects-glow-primary)]
                    active:bg-brand-primary-active
                `],
      ghost: ['button--ghost', `
                    bg-transparent text-brand-primary-hover
                    border-transparent
                    hover:bg-brand-primary-subtle
                    hover:text-brand-primary-emphasis
                `],
      plain: ['button--plain', `
                    bg-transparent text-brand-primary-hover
                    border-transparent
                `]
    },
    rounded: {
      xs: ['button--rounded-xs', `
                    rounded-xs
                `],
      sm: ['button--rounded-sm', `
                    rounded-sm
                `],
      md: ['button--rounded-md', `
                    rounded-md
                `],
      lg: ['button--rounded-lg', `
                    rounded-lg
                `],
      xl: ['button--rounded-xl', `
                    rounded-xl
                `],
      '2xl': ['button--rounded-2xl', `
                    rounded-2xl
                `],
      '3xl': ['button--rounded-3xl', `
                    rounded-3xl
                `],
      full: ['button--rounded-full', `
                    rounded-full
                `]
    },
    disabled: {
      true: ['button--disabled', `
                    opacity-disabled
                    cursor-not-allowed
                    pointer-events-none
                    [transform:none]
                `]
    },
    loading: {
      true: ['button--loading', `
                    cursor-wait
                    [transform:var(--motion-button-active)]
                `]
    },
    highContrast: {
      true: ['button--high-contrast', `

                `]
    },
    brand: {
      true: ['button--brand', `

                `]
    },
    primary: {
      true: ['button--primary', `
                    bg-primary text-primary
                    border-primary
                    hover:bg-secondary
                    hover:border-secondary
                    active:bg-tertiary
                    active:border-tertiary
                `]
    },
    secondary: {
      true: ['button--secondary', `
                    bg-secondary text-secondary
                    border-secondary
                    hover:bg-tertiary
                    hover:border-tertiary
                `]
    },
    tertiary: {
      true: ['button--tertiary', `
                    bg-tertiary text-tertiary
                    border-tertiary
                    hover:bg-tertiary
                    hover:border-tertiary
                `]
    }
  },
  compoundVariants: [
  // brand + primary
  {
    brand: true,
    primary: true,
    css: ['button--brand-primary', `
                    bg-brand-primary-hover text-inverse
                    border-brand-primary-hover
                    hover:bg-brand-primary-active
                    hover:border-brand-primary-active
                    hover:shadow-[var(--effects-glow-primary)]
                    active:bg-brand-primary-emphasis
                `]
  },
  // brand + secondary
  {
    brand: true,
    secondary: true,
    css: ['button--brand-secondary', `
                    bg-brand-secondary-hover text-inverse
                    border-brand-secondary-hover
                    hover:bg-brand-secondary-active
                    hover:border-brand-secondary-active
                    hover:shadow-[var(--effects-glow-secondary)]
                    active:bg-brand-secondary-emphasis
                `]
  },
  // brand + tertiary
  {
    brand: true,
    tertiary: true,
    css: ['button--brand-tertiary', `
                    bg-brand-tertiary-hover text-inverse
                    border-brand-tertiary-hover
                    hover:bg-brand-tertiary-active
                    hover:border-brand-tertiary-active
                    hover:shadow-[var(--effects-glow-tertiary)]
                    active:bg-brand-tertiary-emphasis
                `]
  }],
  defaultVariants: {
    size: 'md'
  }
})