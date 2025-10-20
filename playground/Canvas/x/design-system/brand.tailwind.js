// Auto-generated Tailwind plugin from brand config
import plugin from "tailwindcss/plugin"

export default plugin(({ matchUtilities, addUtilities }) => {
  // Foundation color utilities
  matchUtilities({ bg: (value) => ({ backgroundColor: value }) }, { values: {
    "neutral-50": "#fafafa",
    "neutral-100": "#f5f5f5",
    "neutral-200": "#e5e5e5",
    "neutral-300": "#d4d4d4",
    "neutral-400": "#a3a3a3",
    "neutral-500": "#737373",
    "neutral-600": "#525252",
    "neutral-700": "#404040",
    "neutral-800": "#262626",
    "neutral-900": "#171717",
    "neutral-950": "#0a0a0a"
} })
  matchUtilities({ text: (value) => ({ color: value }) }, { values: {
    "neutral-50": "#fafafa",
    "neutral-100": "#f5f5f5",
    "neutral-200": "#e5e5e5",
    "neutral-300": "#d4d4d4",
    "neutral-400": "#a3a3a3",
    "neutral-500": "#737373",
    "neutral-600": "#525252",
    "neutral-700": "#404040",
    "neutral-800": "#262626",
    "neutral-900": "#171717",
    "neutral-950": "#0a0a0a"
} })
  matchUtilities({ border: (value) => ({ borderColor: value }) }, { values: {
    "neutral-50": "#fafafa",
    "neutral-100": "#f5f5f5",
    "neutral-200": "#e5e5e5",
    "neutral-300": "#d4d4d4",
    "neutral-400": "#a3a3a3",
    "neutral-500": "#737373",
    "neutral-600": "#525252",
    "neutral-700": "#404040",
    "neutral-800": "#262626",
    "neutral-900": "#171717",
    "neutral-950": "#0a0a0a"
} })

  // Semantic background colors
  matchUtilities({ bg: (value) => ({ backgroundColor: value }) }, { values: {
    primary: "#fff",
    secondary: "#fafafa",
    tertiary: "#f5f5f5",
    inverse: "#171717",
    backdrop: "rgb(0 0 0 / 50%)",
    overlay: "rgb(0 0 0 / 10%)",
    scrim: "rgb(0 0 0 / 80%)",
    "brand-primary-hover": "#18b8c2",
    "brand-primary-active": "#1794a3",
    "brand-primary-subtle": "#eefdfd",
    "brand-primary-muted": "#d3fafa",
    "brand-primary-emphasis": "#197785",
    "brand-secondary-hover": "#34d5dc",
    "brand-secondary-active": "#74e9ec",
    "brand-secondary-subtle": "#b2f4f5",
    "brand-secondary-muted": "#eefdfd",
    "brand-secondary-emphasis": "#1d616d",
    "brand-tertiary-hover": "#b2f4f5",
    "brand-tertiary-active": "#74e9ec",
    "brand-tertiary-subtle": "#eefdfd",
    "brand-tertiary-muted": "#d3fafa",
    "brand-tertiary-emphasis": "#1d515c",
    "status-success": "#10b981",
    "status-success-hover": "#059669",
    "status-success-active": "#047857",
    "status-success-subtle": "#ecfdf5",
    "status-success-muted": "#d1fae5",
    "status-success-emphasis": "#065f46",
    "status-error": "#ef4444",
    "status-error-hover": "#dc2626",
    "status-error-active": "#b91c1c",
    "status-error-subtle": "#fef2f2",
    "status-error-muted": "#fecaca",
    "status-error-emphasis": "#991b1b",
    "status-warning": "#f59e0b",
    "status-warning-hover": "#d97706",
    "status-warning-active": "#b45309",
    "status-warning-subtle": "#fffbeb",
    "status-warning-muted": "#fed7aa",
    "status-warning-emphasis": "#92400e",
    "status-info": "#3b82f6",
    "status-info-hover": "#2563eb",
    "status-info-active": "#1d4ed8",
    "status-info-subtle": "#eff6ff",
    "status-info-muted": "#dbeafe",
    "status-info-emphasis": "#1e40af",
    "surface-overlay": "#fff",
    "surface-selected": "#eefdfd",
    "surface-disabled": "#f9fafb"
} })

  // Semantic text colors
  matchUtilities({ text: (value) => ({ color: value }) }, { values: {
    primary: "#171717",
    secondary: "#525252",
    tertiary: "#737373",
    inverse: "#fff",
    disabled: "#a3a3a3",
    placeholder: "#a3a3a3",
    "brand-primary-hover": "#18b8c2",
    "brand-primary-active": "#1794a3",
    "brand-primary-subtle": "#eefdfd",
    "brand-primary-muted": "#d3fafa",
    "brand-primary-emphasis": "#197785",
    "brand-secondary-hover": "#34d5dc",
    "brand-secondary-active": "#74e9ec",
    "brand-secondary-subtle": "#b2f4f5",
    "brand-secondary-muted": "#eefdfd",
    "brand-secondary-emphasis": "#1d616d",
    "brand-tertiary-hover": "#b2f4f5",
    "brand-tertiary-active": "#74e9ec",
    "brand-tertiary-subtle": "#eefdfd",
    "brand-tertiary-muted": "#d3fafa",
    "brand-tertiary-emphasis": "#1d515c",
    "status-success": "#10b981",
    "status-success-hover": "#059669",
    "status-success-active": "#047857",
    "status-success-subtle": "#ecfdf5",
    "status-success-muted": "#d1fae5",
    "status-success-emphasis": "#065f46",
    "status-error": "#ef4444",
    "status-error-hover": "#dc2626",
    "status-error-active": "#b91c1c",
    "status-error-subtle": "#fef2f2",
    "status-error-muted": "#fecaca",
    "status-error-emphasis": "#991b1b",
    "status-warning": "#f59e0b",
    "status-warning-hover": "#d97706",
    "status-warning-active": "#b45309",
    "status-warning-subtle": "#fffbeb",
    "status-warning-muted": "#fed7aa",
    "status-warning-emphasis": "#92400e",
    "status-info": "#3b82f6",
    "status-info-hover": "#2563eb",
    "status-info-active": "#1d4ed8",
    "status-info-subtle": "#eff6ff",
    "status-info-muted": "#dbeafe",
    "status-info-emphasis": "#1e40af"
} })

  // Semantic border colors
  matchUtilities({ border: (value) => ({ borderColor: value }) }, { values: {
    primary: "#e5e5e5",
    secondary: "#d4d4d4",
    tertiary: "#a3a3a3",
    inverse: "#404040",
    focus: "#18b8c2",
    error: "#ef4444",
    warning: "#f59e0b",
    success: "#10b981",
    info: "#18b8c2",
    "brand-primary-hover": "#18b8c2",
    "brand-primary-active": "#1794a3",
    "brand-primary-subtle": "#eefdfd",
    "brand-primary-muted": "#d3fafa",
    "brand-primary-emphasis": "#197785",
    "brand-secondary-hover": "#34d5dc",
    "brand-secondary-active": "#74e9ec",
    "brand-secondary-subtle": "#b2f4f5",
    "brand-secondary-muted": "#eefdfd",
    "brand-secondary-emphasis": "#1d616d",
    "brand-tertiary-hover": "#b2f4f5",
    "brand-tertiary-active": "#74e9ec",
    "brand-tertiary-subtle": "#eefdfd",
    "brand-tertiary-muted": "#d3fafa",
    "brand-tertiary-emphasis": "#1d515c",
    "status-success": "#10b981",
    "status-success-hover": "#059669",
    "status-success-active": "#047857",
    "status-success-subtle": "#ecfdf5",
    "status-success-muted": "#d1fae5",
    "status-success-emphasis": "#065f46",
    "status-error": "#ef4444",
    "status-error-hover": "#dc2626",
    "status-error-active": "#b91c1c",
    "status-error-subtle": "#fef2f2",
    "status-error-muted": "#fecaca",
    "status-error-emphasis": "#991b1b",
    "status-warning": "#f59e0b",
    "status-warning-hover": "#d97706",
    "status-warning-active": "#b45309",
    "status-warning-subtle": "#fffbeb",
    "status-warning-muted": "#fed7aa",
    "status-warning-emphasis": "#92400e",
    "status-info": "#3b82f6",
    "status-info-hover": "#2563eb",
    "status-info-active": "#1d4ed8",
    "status-info-subtle": "#eff6ff",
    "status-info-muted": "#dbeafe",
    "status-info-emphasis": "#1e40af"
} })

  // Padding utilities
  matchUtilities({ p: (value) => ({ padding: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ px: (value) => ({ paddingLeft: value, paddingRight: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ py: (value) => ({ paddingTop: value, paddingBottom: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ pt: (value) => ({ paddingTop: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ pr: (value) => ({ paddingRight: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ pb: (value) => ({ paddingBottom: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ pl: (value) => ({ paddingLeft: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ ps: (value) => ({ paddingInlineStart: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ pe: (value) => ({ paddingInlineEnd: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })

  // Margin utilities
  matchUtilities({ m: (value) => ({ margin: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ mx: (value) => ({ marginLeft: value, marginRight: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ my: (value) => ({ marginTop: value, marginBottom: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ mt: (value) => ({ marginTop: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ mr: (value) => ({ marginRight: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ mb: (value) => ({ marginBottom: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ ml: (value) => ({ marginLeft: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ ms: (value) => ({ marginInlineStart: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ me: (value) => ({ marginInlineEnd: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })

  // Gap utilities
  matchUtilities({ gap: (value) => ({ gap: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ 'gap-x': (value) => ({ columnGap: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ 'gap-y': (value) => ({ rowGap: value }) }, { values: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4.5rem",
    "4xl": "6rem",
    "5xl": "9rem",
    "6xl": "12rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })

  // Border radius utilities
  matchUtilities({ rounded: (value) => ({ borderRadius: value }) }, { values: {
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
    interactive: "0.375rem",
    container: "0.5rem",
    overlay: "0.75rem",
    embedded: "0.25rem",
    pill: "9999px"
} })

  // Duration utilities
  matchUtilities({ duration: (value) => ({ transitionDuration: value }) }, { values: {
    instant: "0ms",
    micro: "75ms",
    short: "150ms",
    base: "200ms",
    moderate: "300ms",
    long: "500ms",
    extended: "800ms"
} })

  // Opacity utilities
  matchUtilities({ opacity: (value) => ({ opacity: value }) }, { values: {
    disabled: "0.5",
    subtle: "0.8",
    medium: "0.6",
    visible: "1",
    hidden: "0",
    overlay: "0.9",
    backdrop: "0.5"
} })

  // Font size utilities
  matchUtilities({ text: (value) => ({ fontSize: value }) }, { values: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem"
} })

  // Semantic typography utilities
  addUtilities({ '.display-large': { fontSize: '4.5rem' } })
  addUtilities({ '.display-medium': { fontSize: '3.75rem' } })
  addUtilities({ '.display-small': { fontSize: '3rem' } })
  addUtilities({ '.headline-large': { fontSize: '2.25rem' } })
  addUtilities({ '.headline-medium': { fontSize: '1.875rem' } })
  addUtilities({ '.headline-small': { fontSize: '1.5rem' } })
  addUtilities({ '.title-large': { fontSize: '1.25rem' } })
  addUtilities({ '.title-medium': { fontSize: '1.125rem' } })
  addUtilities({ '.title-small': { fontSize: '1rem' } })
  addUtilities({ '.label-large': { fontSize: '0.875rem' } })
  addUtilities({ '.label-medium': { fontSize: '0.75rem' } })
  addUtilities({ '.label-small': { fontSize: '0.75rem' } })
  addUtilities({ '.body-large': { fontSize: '1.125rem' } })
  addUtilities({ '.body-medium': { fontSize: '1rem' } })
  addUtilities({ '.body-small': { fontSize: '0.875rem' } })

  // Sizing utilities
  matchUtilities({ w: (value) => ({ width: value }) }, { values: {
    xs: "1.25rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "5rem",
    "3xl": "6rem",
    "4xl": "8rem",
    "5xl": "10rem",
    "6xl": "14rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ h: (value) => ({ height: value }) }, { values: {
    xs: "1.25rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "5rem",
    "3xl": "6rem",
    "4xl": "8rem",
    "5xl": "10rem",
    "6xl": "14rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ 'min-h': (value) => ({ minHeight: value }) }, { values: {
    xs: "1.25rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "5rem",
    "3xl": "6rem",
    "4xl": "8rem",
    "5xl": "10rem",
    "6xl": "14rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ 'min-w': (value) => ({ minWidth: value }) }, { values: {
    xs: "1.25rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "5rem",
    "3xl": "6rem",
    "4xl": "8rem",
    "5xl": "10rem",
    "6xl": "14rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ 'max-h': (value) => ({ maxHeight: value }) }, { values: {
    xs: "1.25rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "5rem",
    "3xl": "6rem",
    "4xl": "8rem",
    "5xl": "10rem",
    "6xl": "14rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
  matchUtilities({ 'max-w': (value) => ({ maxWidth: value }) }, { values: {
    xs: "1.25rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "5rem",
    "3xl": "6rem",
    "4xl": "8rem",
    "5xl": "10rem",
    "6xl": "14rem",
    "7xl": "18rem",
    "8xl": "24rem",
    "9xl": "32rem"
} })
})
