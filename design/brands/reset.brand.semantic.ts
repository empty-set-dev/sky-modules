import Brand from '../Brand'

export default {
    colors: {
        background: {
            primary: '#ffffff', // white background
            secondary: '#fafafa', // light gray background
            tertiary: '#f5f5f5', // very light gray
            inverse: '#171717', // dark background
            backdrop: 'rgba(0, 0, 0, 0.5)', // modal backdrop
            overlay: 'rgba(0, 0, 0, 0.1)', // light overlay
            scrim: 'rgba(0, 0, 0, 0.8)', // dark overlay
        },
        foreground: {
            primary: '#171717', // primary text
            secondary: '#525252', // secondary text
            tertiary: '#737373', // tertiary text
            inverse: '#ffffff', // inverse text on dark bg
            disabled: '#a3a3a3', // disabled text
            placeholder: '#a3a3a3', // placeholder text
        },
        border: {
            primary: '#e5e5e5', // primary border
            secondary: '#d4d4d4', // secondary border
            tertiary: '#a3a3a3', // tertiary border
            inverse: '#404040', // inverse border
            focus: '#18b8c2', // focus border - brand 500
            error: '#ef4444', // error border
            warning: '#f59e0b', // warning border
            success: '#10b981', // success border
            info: '#18b8c2', // info border - brand 500
        },
        brand: {
            primaryHover: '#18b8c2', // primary hover - brand 500
            primaryActive: '#1794a3', // primary active - brand 600
            primarySubtle: '#eefdfd', // primary subtle - brand 50
            primaryMuted: '#d3fafa', // primary muted - brand 100
            primaryEmphasis: '#197785', // primary emphasis - brand 700
            secondaryHover: '#34d5dc', // secondary hover - brand 400
            secondaryActive: '#74e9ec', // secondary active - brand 300
            secondarySubtle: '#b2f4f5', // secondary subtle - brand 200
            secondaryMuted: '#eefdfd', // secondary muted - brand 50
            secondaryEmphasis: '#1d616d', // secondary emphasis - brand 800
            tertiaryHover: '#b2f4f5', // tertiary hover - brand 200
            tertiaryActive: '#74e9ec', // tertiary active - brand 300
            tertiarySubtle: '#eefdfd', // tertiary subtle - brand 50
            tertiaryMuted: '#d3fafa', // tertiary muted - brand 100
            tertiaryEmphasis: '#1d515c', // tertiary emphasis - brand 900
        },
        status: {
            success: '#10b981', // success
            successHover: '#059669', // success hover
            successActive: '#047857', // success active
            successSubtle: '#ecfdf5', // success subtle
            successMuted: '#d1fae5', // success muted
            successEmphasis: '#065f46', // success emphasis
            error: '#ef4444', // error
            errorHover: '#dc2626', // error hover
            errorActive: '#b91c1c', // error active
            errorSubtle: '#fef2f2', // error subtle
            errorMuted: '#fecaca', // error muted
            errorEmphasis: '#991b1b', // error emphasis
            warning: '#f59e0b', // warning
            warningHover: '#d97706', // warning hover
            warningActive: '#b45309', // warning active
            warningSubtle: '#fffbeb', // warning subtle
            warningMuted: '#fed7aa', // warning muted
            warningEmphasis: '#92400e', // warning emphasis
            info: '#3b82f6', // info
            infoHover: '#2563eb', // info hover
            infoActive: '#1d4ed8', // info active
            infoSubtle: '#eff6ff', // info subtle
            infoMuted: '#dbeafe', // info muted
            infoEmphasis: '#1e40af', // info emphasis
        },
        surface: {
            overlay: '#ffffff', // overlay surface
            selected: '#eefdfd', // selected surface - brand 50
            disabled: '#f9fafb', // disabled surface
        },
        effects: {
            glowPrimary: '0 0 12px rgba(24, 184, 194, 0.5)', // primary glow - brand 500
            glowSecondary: '0 0 12px rgba(52, 213, 220, 0.3)', // secondary glow - brand 400
            glowTertiary: '0 0 8px rgba(116, 233, 236, 0.2)', // tertiary glow - brand 300
            glowFocus: '0 0 8px rgba(24, 184, 194, 0.6)', // focus glow - brand 500
            glowHover: '0 0 16px rgba(24, 184, 194, 0.3)', // hover glow - brand 500
            glowActive: '0 0 20px rgba(23, 148, 163, 0.7)', // active glow - brand 600
            glowSubtle: '0 0 6px rgba(116, 233, 236, 0.2)', // subtle glow - brand 300
            glowStrong: '0 0 24px rgba(24, 184, 194, 0.8)', // strong glow - brand 500
            glowBrand: '0 0 12px rgba(24, 184, 194, 0.5)', // brand glow - brand 500
            glowSuccess: '0 0 12px rgba(16, 185, 129, 0.5)', // success glow
            glowError: '0 0 12px rgba(239, 68, 68, 0.5)', // error glow
            glowWarning: '0 0 12px rgba(245, 158, 11, 0.5)', // warning glow
            glowInfo: '0 0 12px rgba(24, 184, 194, 0.5)', // info glow - brand 500
        },
    },
    opacity: {
        disabled: '0.5', // disabled opacity
        subtle: '0.8', // subtle opacity
        medium: '0.6', // medium opacity
        visible: '1', // visible opacity
        hidden: '0', // hidden opacity
        overlay: '0.9', // overlay opacity
        backdrop: '0.5', // backdrop opacity
    },
    radius: {
        interactive: '0.375rem', // md - for buttons, inputs
        container: '0.5rem', // lg - for cards, containers
        overlay: '0.75rem', // xl - for modals, overlays
        embedded: '0.25rem', // sm - for embedded content
        pill: '9999px', // full - for pills, badges
    },
    duration: {
        instant: '0ms',
        micro: '75ms',
        short: '150ms',
        base: '200ms',
        moderate: '300ms',
        long: '500ms',
        extended: '800ms',
    },
    zIndex: {
        dropdown: 100, // dropdown z-index
        sticky: 200, // sticky z-index
        fixed: 300, // fixed z-index
        modal: 400, // modal z-index
        popover: 500, // popover z-index
        tooltip: 600, // tooltip z-index
        toast: 700, // toast z-index
        overlay: 800, // overlay z-index
    },
    animations: {
        primaryIn: 'fadeIn 300ms ease-out', // primary fade in
        primaryOut: 'fadeOut 300ms ease-in', // primary fade out
        primaryInOut: 'fadeInOut 600ms ease-in-out', // primary fade in/out
        secondaryIn: 'slideIn 250ms ease-out', // secondary slide in
        secondaryOut: 'slideOut 250ms ease-in', // secondary slide out
        secondaryInOut: 'slideInOut 500ms ease-in-out', // secondary slide in/out
        tertiaryIn: 'scaleIn 200ms ease-out', // tertiary scale in
        tertiaryOut: 'scaleOut 200ms ease-in', // tertiary scale out
        tertiaryInOut: 'scaleInOut 400ms ease-in-out', // tertiary scale in/out
    },
    typography: {
        primary: 'var(--font-sans)', // primary font family
        secondary: 'var(--font-serif)', // secondary font family
        tertiary: 'var(--font-mono)', // tertiary font family

        display: {
            large: '7xl', // large display text
            medium: '6xl', // medium display text
            small: '5xl', // small display text
        },
        headline: {
            large: '4xl', // large headline
            medium: '3xl', // medium headline
            small: '2xl', // small headline
        },
        title: {
            large: 'xl', // large title
            medium: 'lg', // medium title
            small: 'md', // small title
        },
        label: {
            large: 'sm', // large label
            medium: 'xs', // medium label
            small: 'xs', // small label
        },
        body: {
            large: 'lg', // large body text
            medium: 'md', // medium body text
            small: 'sm', // small body text
        },
    },
    motion: {
        translate: {
            hover: 'translateY(-2px)', // lift on hover
            active: 'translateY(1px)', // slight drop
            pressed: 'translateY(2px)', // push down
            nudge: 'translateY(-1px)', // micro shift
        },
        scale: {
            hover: '1.02', // grow on hover
            active: '0.98', // shrink on click
            pressed: '0.97', // compress
            emphasis: '1.05', // emphasis scale
        },
        button: {
            hover: 'translateY(-2px)', // button lift
            active: 'translateY(1px) scale(0.98)', // button click
            pressed: 'translateY(2px) scale(0.97)', // button hold
        },
        card: {
            hover: 'translateY(-4px) scale(1.02)', // card lift
            active: 'translateY(0) scale(1)', // card return
        },
        pop: 'translateY(-4px) scale(1.05)', // pop effect
        push: 'translateY(4px) scale(0.98)', // push effect
        bounce: 'translateY(-2px)', // bounce effect
        wiggle: 'rotate(2deg)', // wiggle effect
    },
} satisfies Brand['semantic']
