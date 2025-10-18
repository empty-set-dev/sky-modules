export default function brandPlugin({ matchUtilities }: { matchUtilities: any }) {
  // Background utilities
  matchUtilities(
    {
      'bg': (value: string) => ({
        backgroundColor: value,
      }),
    },
    {
      values: {        'neutral-50': '#fafafa',
        'neutral-100': '#f5f5f5',
        'neutral-200': '#e5e5e5',
        'neutral-300': '#d4d4d4',
        'neutral-400': '#a3a3a3',
        'neutral-500': '#737373',
        'neutral-600': '#525252',
        'neutral-700': '#404040',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
        'neutral-950': '#0a0a0a',
        'primary': '#ffffff',
        'secondary': '#fafafa',
        'tertiary': '#f5f5f5',
        'inverse': '#171717',
        'backdrop': 'rgba(0, 0, 0, 0.5)',
        'overlay': 'rgba(0, 0, 0, 0.1)',
        'scrim': 'rgba(0, 0, 0, 0.8)',
        'surface-overlay': '#ffffff',
        'surface-selected': '#eefdfd',
        'surface-disabled': '#f9fafb',
        'brand-primary-hover': '#18b8c2',
        'brand-primary-active': '#1794a3',
        'brand-primary-subtle': '#eefdfd',
        'brand-primary-muted': '#d3fafa',
        'brand-primary-emphasis': '#197785',
        'brand-secondary-hover': '#34d5dc',
        'brand-secondary-active': '#74e9ec',
        'brand-secondary-subtle': '#b2f4f5',
        'brand-secondary-muted': '#eefdfd',
        'brand-secondary-emphasis': '#1d616d',
        'brand-tertiary-hover': '#b2f4f5',
        'brand-tertiary-active': '#74e9ec',
        'brand-tertiary-subtle': '#eefdfd',
        'brand-tertiary-muted': '#d3fafa',
        'brand-tertiary-emphasis': '#1d515c',
        'status-success': '#10b981',
        'status-success-hover': '#059669',
        'status-success-active': '#047857',
        'status-success-subtle': '#ecfdf5',
        'status-success-muted': '#d1fae5',
        'status-success-emphasis': '#065f46',
        'status-error': '#ef4444',
        'status-error-hover': '#dc2626',
        'status-error-active': '#b91c1c',
        'status-error-subtle': '#fef2f2',
        'status-error-muted': '#fecaca',
        'status-error-emphasis': '#991b1b',
        'status-warning': '#f59e0b',
        'status-warning-hover': '#d97706',
        'status-warning-active': '#b45309',
        'status-warning-subtle': '#fffbeb',
        'status-warning-muted': '#fed7aa',
        'status-warning-emphasis': '#92400e',
        'status-info': '#3b82f6',
        'status-info-hover': '#2563eb',
        'status-info-active': '#1d4ed8',
        'status-info-subtle': '#eff6ff',
        'status-info-muted': '#dbeafe',
        'status-info-emphasis': '#1e40af',
        'effects-glow-primary': '0 0 12px rgba(24, 184, 194, 0.5)',
        'effects-glow-secondary': '0 0 12px rgba(52, 213, 220, 0.3)',
        'effects-glow-tertiary': '0 0 8px rgba(116, 233, 236, 0.2)',
        'effects-glow-focus': '0 0 8px rgba(24, 184, 194, 0.6)',
        'effects-glow-hover': '0 0 16px rgba(24, 184, 194, 0.3)',
        'effects-glow-active': '0 0 20px rgba(23, 148, 163, 0.7)',
        'effects-glow-subtle': '0 0 6px rgba(116, 233, 236, 0.2)',
        'effects-glow-strong': '0 0 24px rgba(24, 184, 194, 0.8)',
        'effects-glow-brand': '0 0 12px rgba(24, 184, 194, 0.5)',
        'effects-glow-success': '0 0 12px rgba(16, 185, 129, 0.5)',
        'effects-glow-error': '0 0 12px rgba(239, 68, 68, 0.5)',
        'effects-glow-warning': '0 0 12px rgba(245, 158, 11, 0.5)',
        'effects-glow-info': '0 0 12px rgba(24, 184, 194, 0.5)',
      }
    }
  )

  // Text utilities
  matchUtilities(
    {
      'text': (value: string) => ({
        color: value,
      }),
    },
    {
      values: {        'neutral-50': '#fafafa',
        'neutral-100': '#f5f5f5',
        'neutral-200': '#e5e5e5',
        'neutral-300': '#d4d4d4',
        'neutral-400': '#a3a3a3',
        'neutral-500': '#737373',
        'neutral-600': '#525252',
        'neutral-700': '#404040',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
        'neutral-950': '#0a0a0a',
        'primary': '#171717',
        'secondary': '#525252',
        'tertiary': '#737373',
        'inverse': '#ffffff',
        'disabled': '#a3a3a3',
        'placeholder': '#a3a3a3',
        'brand-primary-hover': '#18b8c2',
        'brand-primary-active': '#1794a3',
        'brand-primary-subtle': '#eefdfd',
        'brand-primary-muted': '#d3fafa',
        'brand-primary-emphasis': '#197785',
        'brand-secondary-hover': '#34d5dc',
        'brand-secondary-active': '#74e9ec',
        'brand-secondary-subtle': '#b2f4f5',
        'brand-secondary-muted': '#eefdfd',
        'brand-secondary-emphasis': '#1d616d',
        'brand-tertiary-hover': '#b2f4f5',
        'brand-tertiary-active': '#74e9ec',
        'brand-tertiary-subtle': '#eefdfd',
        'brand-tertiary-muted': '#d3fafa',
        'brand-tertiary-emphasis': '#1d515c',
        'status-success': '#10b981',
        'status-success-hover': '#059669',
        'status-success-active': '#047857',
        'status-success-subtle': '#ecfdf5',
        'status-success-muted': '#d1fae5',
        'status-success-emphasis': '#065f46',
        'status-error': '#ef4444',
        'status-error-hover': '#dc2626',
        'status-error-active': '#b91c1c',
        'status-error-subtle': '#fef2f2',
        'status-error-muted': '#fecaca',
        'status-error-emphasis': '#991b1b',
        'status-warning': '#f59e0b',
        'status-warning-hover': '#d97706',
        'status-warning-active': '#b45309',
        'status-warning-subtle': '#fffbeb',
        'status-warning-muted': '#fed7aa',
        'status-warning-emphasis': '#92400e',
        'status-info': '#3b82f6',
        'status-info-hover': '#2563eb',
        'status-info-active': '#1d4ed8',
        'status-info-subtle': '#eff6ff',
        'status-info-muted': '#dbeafe',
        'status-info-emphasis': '#1e40af',
        'effects-glow-primary': '0 0 12px rgba(24, 184, 194, 0.5)',
        'effects-glow-secondary': '0 0 12px rgba(52, 213, 220, 0.3)',
        'effects-glow-tertiary': '0 0 8px rgba(116, 233, 236, 0.2)',
        'effects-glow-focus': '0 0 8px rgba(24, 184, 194, 0.6)',
        'effects-glow-hover': '0 0 16px rgba(24, 184, 194, 0.3)',
        'effects-glow-active': '0 0 20px rgba(23, 148, 163, 0.7)',
        'effects-glow-subtle': '0 0 6px rgba(116, 233, 236, 0.2)',
        'effects-glow-strong': '0 0 24px rgba(24, 184, 194, 0.8)',
        'effects-glow-brand': '0 0 12px rgba(24, 184, 194, 0.5)',
        'effects-glow-success': '0 0 12px rgba(16, 185, 129, 0.5)',
        'effects-glow-error': '0 0 12px rgba(239, 68, 68, 0.5)',
        'effects-glow-warning': '0 0 12px rgba(245, 158, 11, 0.5)',
        'effects-glow-info': '0 0 12px rgba(24, 184, 194, 0.5)',
      }
    }
  )

  // Border utilities
  matchUtilities(
    {
      'border': (value: string) => ({
        borderColor: value,
      }),
    },
    {
      values: {        'neutral-50': '#fafafa',
        'neutral-100': '#f5f5f5',
        'neutral-200': '#e5e5e5',
        'neutral-300': '#d4d4d4',
        'neutral-400': '#a3a3a3',
        'neutral-500': '#737373',
        'neutral-600': '#525252',
        'neutral-700': '#404040',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
        'neutral-950': '#0a0a0a',
        'primary': '#e5e5e5',
        'secondary': '#d4d4d4',
        'tertiary': '#a3a3a3',
        'inverse': '#404040',
        'focus': '#18b8c2',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'success': '#10b981',
        'info': '#18b8c2',
        'brand-primary-hover': '#18b8c2',
        'brand-primary-active': '#1794a3',
        'brand-primary-subtle': '#eefdfd',
        'brand-primary-muted': '#d3fafa',
        'brand-primary-emphasis': '#197785',
        'brand-secondary-hover': '#34d5dc',
        'brand-secondary-active': '#74e9ec',
        'brand-secondary-subtle': '#b2f4f5',
        'brand-secondary-muted': '#eefdfd',
        'brand-secondary-emphasis': '#1d616d',
        'brand-tertiary-hover': '#b2f4f5',
        'brand-tertiary-active': '#74e9ec',
        'brand-tertiary-subtle': '#eefdfd',
        'brand-tertiary-muted': '#d3fafa',
        'brand-tertiary-emphasis': '#1d515c',
        'status-success': '#10b981',
        'status-success-hover': '#059669',
        'status-success-active': '#047857',
        'status-success-subtle': '#ecfdf5',
        'status-success-muted': '#d1fae5',
        'status-success-emphasis': '#065f46',
        'status-error': '#ef4444',
        'status-error-hover': '#dc2626',
        'status-error-active': '#b91c1c',
        'status-error-subtle': '#fef2f2',
        'status-error-muted': '#fecaca',
        'status-error-emphasis': '#991b1b',
        'status-warning': '#f59e0b',
        'status-warning-hover': '#d97706',
        'status-warning-active': '#b45309',
        'status-warning-subtle': '#fffbeb',
        'status-warning-muted': '#fed7aa',
        'status-warning-emphasis': '#92400e',
        'status-info': '#3b82f6',
        'status-info-hover': '#2563eb',
        'status-info-active': '#1d4ed8',
        'status-info-subtle': '#eff6ff',
        'status-info-muted': '#dbeafe',
        'status-info-emphasis': '#1e40af',
        'effects-glow-primary': '0 0 12px rgba(24, 184, 194, 0.5)',
        'effects-glow-secondary': '0 0 12px rgba(52, 213, 220, 0.3)',
        'effects-glow-tertiary': '0 0 8px rgba(116, 233, 236, 0.2)',
        'effects-glow-focus': '0 0 8px rgba(24, 184, 194, 0.6)',
        'effects-glow-hover': '0 0 16px rgba(24, 184, 194, 0.3)',
        'effects-glow-active': '0 0 20px rgba(23, 148, 163, 0.7)',
        'effects-glow-subtle': '0 0 6px rgba(116, 233, 236, 0.2)',
        'effects-glow-strong': '0 0 24px rgba(24, 184, 194, 0.8)',
        'effects-glow-brand': '0 0 12px rgba(24, 184, 194, 0.5)',
        'effects-glow-success': '0 0 12px rgba(16, 185, 129, 0.5)',
        'effects-glow-error': '0 0 12px rgba(239, 68, 68, 0.5)',
        'effects-glow-warning': '0 0 12px rgba(245, 158, 11, 0.5)',
        'effects-glow-info': '0 0 12px rgba(24, 184, 194, 0.5)',
      }
    }
  )

  // Spacing utilities
  matchUtilities(
    {
      'p': (value: string) => ({
        padding: value,
      }),
      'px': (value: string) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      'py': (value: string) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      'pt': (value: string) => ({
        paddingTop: value,
      }),
      'pr': (value: string) => ({
        paddingRight: value,
      }),
      'pb': (value: string) => ({
        paddingBottom: value,
      }),
      'pl': (value: string) => ({
        paddingLeft: value,
      }),
      'ps': (value: string) => ({
        paddingInlineStart: value,
      }),
      'pe': (value: string) => ({
        paddingInlineEnd: value,
      }),
      'm': (value: string) => ({
        margin: value,
      }),
      'mx': (value: string) => ({
        marginLeft: value,
        marginRight: value,
      }),
      'my': (value: string) => ({
        marginTop: value,
        marginBottom: value,
      }),
      'mt': (value: string) => ({
        marginTop: value,
      }),
      'mr': (value: string) => ({
        marginRight: value,
      }),
      'mb': (value: string) => ({
        marginBottom: value,
      }),
      'ml': (value: string) => ({
        marginLeft: value,
      }),
      'ms': (value: string) => ({
        marginInlineStart: value,
      }),
      'me': (value: string) => ({
        marginInlineEnd: value,
      }),
      'gap': (value: string) => ({
        gap: value,
      }),
      'gap-x': (value: string) => ({
        columnGap: value,
      }),
      'gap-y': (value: string) => ({
        rowGap: value,
      }),
    },
    {
      values: {        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4.5rem',
        '4xl': '6rem',
        '5xl': '9rem',
        '6xl': '12rem',
        '7xl': '18rem',
        '8xl': '24rem',
        '9xl': '32rem',
      }
    }
  )

  // Sizing utilities
  matchUtilities(
    {
      'w': (value: string) => ({
        width: value,
      }),
      'h': (value: string) => ({
        height: value,
      }),
      'min-w': (value: string) => ({
        minWidth: value,
      }),
      'min-h': (value: string) => ({
        minHeight: value,
      }),
      'max-w': (value: string) => ({
        maxWidth: value,
      }),
      'max-h': (value: string) => ({
        maxHeight: value,
      }),
      'size': (value: string) => ({
        width: value,
        height: value,
      }),
    },
    {
      values: {        'xs': '1.25rem',
        'sm': '2rem',
        'md': '2.5rem',
        'lg': '3rem',
        'xl': '4rem',
        '2xl': '5rem',
        '3xl': '6rem',
        '4xl': '8rem',
        '5xl': '10rem',
        '6xl': '14rem',
        '7xl': '18rem',
        '8xl': '24rem',
        '9xl': '32rem',
      }
    }
  )

  // Font size utilities
  matchUtilities(
    {
      'text-size': (value: string) => ({
        fontSize: value,
      }),
    },
    {
      values: {        'xs': '0.75rem',
        'sm': '0.875rem',
        'md': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      }
    }
  )

  // Typography utilities
  matchUtilities(
    {
      'label-small': () => ({
        fontSize: '0.75rem',
        fontWeight: '500',
        lineHeight: '1rem',
      }),
      'label-medium': () => ({
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.25rem',
      }),
      'label-large': () => ({
        fontSize: '1rem',
        fontWeight: '500',
        lineHeight: '1.5rem',
      }),
      'body-small': () => ({
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.25rem',
      }),
      'body-medium': () => ({
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5rem',
      }),
      'body-large': () => ({
        fontSize: '1.125rem',
        fontWeight: '400',
        lineHeight: '1.75rem',
      }),
      'title-small': () => ({
        fontSize: '1.125rem',
        fontWeight: '600',
        lineHeight: '1.75rem',
      }),
      'title-medium': () => ({
        fontSize: '1.25rem',
        fontWeight: '600',
        lineHeight: '1.875rem',
      }),
      'title-large': () => ({
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '2rem',
      }),
      'headline-small': () => ({
        fontSize: '1.875rem',
        fontWeight: '700',
        lineHeight: '2.25rem',
      }),
      'headline-medium': () => ({
        fontSize: '2.25rem',
        fontWeight: '700',
        lineHeight: '2.5rem',
      }),
      'headline-large': () => ({
        fontSize: '3rem',
        fontWeight: '700',
        lineHeight: '3rem',
      }),
      'display-small': () => ({
        fontSize: '3.75rem',
        fontWeight: '800',
        lineHeight: '3.75rem',
      }),
      'display-medium': () => ({
        fontSize: '4.5rem',
        fontWeight: '800',
        lineHeight: '4.5rem',
      }),
      'display-large': () => ({
        fontSize: '6rem',
        fontWeight: '800',
        lineHeight: '6rem',
      }),
    },
    {
      values: { 'DEFAULT': '' }
    }
  )

  // Radius utilities
  matchUtilities(
    {
      'rounded': (value: string) => ({
        borderRadius: value,
      }),
    },
    {
      values: {        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
        'interactive': '0.375rem',
        'container': '0.5rem',
        'overlay': '0.75rem',
        'embedded': '0.25rem',
        'pill': '9999px',
      }
    }
  )

  // Shadow utilities
  matchUtilities(
    {
      'shadow': (value: string) => ({
        boxShadow: value,
      }),
    },
    {
      values: {        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
      }
    }
  )

  // Effect utilities (glow, filter)
  matchUtilities(
    {
      'glow': (value: string) => ({
        filter: `drop-shadow(${value})`,
      }),
    },
    {
      values: {        'xs': '0 0 4px rgba(59, 130, 246, 0.3)',
        'sm': '0 0 8px rgba(59, 130, 246, 0.4)',
        'md': '0 0 12px rgba(59, 130, 246, 0.5)',
        'lg': '0 0 16px rgba(59, 130, 246, 0.6)',
        'xl': '0 0 24px rgba(59, 130, 246, 0.7)',
        '2xl': '0 0 32px rgba(59, 130, 246, 0.8)',
        '3xl': '0 0 48px rgba(59, 130, 246, 0.9)',
        'primary': '0 0 12px rgba(24, 184, 194, 0.5)',
        'secondary': '0 0 12px rgba(52, 213, 220, 0.3)',
        'tertiary': '0 0 8px rgba(116, 233, 236, 0.2)',
        'focus': '0 0 8px rgba(24, 184, 194, 0.6)',
        'hover': '0 0 16px rgba(24, 184, 194, 0.3)',
        'active': '0 0 20px rgba(23, 148, 163, 0.7)',
        'subtle': '0 0 6px rgba(116, 233, 236, 0.2)',
        'strong': '0 0 24px rgba(24, 184, 194, 0.8)',
        'brand': '0 0 12px rgba(24, 184, 194, 0.5)',
        'success': '0 0 12px rgba(16, 185, 129, 0.5)',
        'error': '0 0 12px rgba(239, 68, 68, 0.5)',
        'warning': '0 0 12px rgba(245, 158, 11, 0.5)',
        'info': '0 0 12px rgba(24, 184, 194, 0.5)',
      }
    }
  )

  // Duration utilities
  matchUtilities(
    {
      'duration': (value: string) => ({
        transitionDuration: value,
      }),
    },
    {
      values: {        'instant': '0ms',
        'micro': '75ms',
        'short': '150ms',
        'base': '200ms',
        'moderate': '300ms',
        'long': '500ms',
        'extended': '800ms',
      }
    }
  )

  // Opacity utilities
  matchUtilities(
    {
      'opacity': (value: string) => ({
        opacity: value,
      }),
    },
    {
      values: {        'disabled': '0.5',
        'subtle': '0.8',
        'medium': '0.6',
        'visible': '1',
        'hidden': '0',
        'overlay': '0.9',
        'backdrop': '0.5',
      }
    }
  )
}