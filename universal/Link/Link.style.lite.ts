import { tv } from 'tailwind-variants'

export const LinkSx = tv({
    base: 'text-[var(--brand-primary)]',
    variants: {
        underline: {
            true: 'underline',
        },
        hover: {
            true: 'text-[var(--brand-primary-hover)]',
        },
    },
})
