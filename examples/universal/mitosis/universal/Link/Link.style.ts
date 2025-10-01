import { tv } from 'tailwind-variants';
const getLinkStyle = tv({
  slots: {
    base: `
            text-[var(--brand-primary)]
            hover:text-[var(--brand-primary-hover)]
            hover:bg-[var(--interactive-hover)]
            active:text-[var(--brand-primary-active)]
            active:bg-[var(--interactive-active)]
            pressed:text-[var(--brand-primary-active)]
            pressed:bg-[var(--interactive-active)]
            focus:border-[var(--border-focus)]
            focus:shadow-[var(--effects-glow-focus)]
        `
  },
  variants: {
    underline: {
      true: {
        base: 'underline'
      }
    }
  }
});
export default getLinkStyle