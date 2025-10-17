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
            muted: '#e5e5e5', // muted background
            subtle: '#f5f5f5', // subtle background
            emphasis: '#171717', // emphasized background
        },
        foreground: {
            primary: '#171717', // primary text
            secondary: '#525252', // secondary text
            tertiary: '#737373', // tertiary text
            inverse: '#ffffff', // inverse text on dark bg
            disabled: '#a3a3a3', // disabled text
            placeholder: '#a3a3a3', // placeholder text
            muted: '#737373', // muted text
            subtle: '#525252', // subtle text
            emphasis: '#171717', // emphasized text
        },
        border: {
            primary: '#e5e5e5', // primary border
            secondary: '#d4d4d4', // secondary border
            tertiary: '#a3a3a3', // tertiary border
            inverse: '#404040', // inverse border
            focus: '#3b82f6', // focus border
            error: '#ef4444', // error border
            warning: '#f59e0b', // warning border
            success: '#10b981', // success border
            info: '#3b82f6', // info border
            muted: '#f5f5f5', // muted border
            subtle: '#e5e5e5', // subtle border
            emphasis: '#737373', // emphasized border
        },
        brand: {
            primaryHover: '#2563eb', // primary hover
            primaryActive: '#1d4ed8', // primary active
            primarySubtle: '#eff6ff', // primary subtle
            primaryMuted: '#dbeafe', // primary muted
            primaryEmphasis: '#1e40af', // primary emphasis
            secondaryHover: '#6b7280', // secondary hover
            secondaryActive: '#4b5563', // secondary active
            secondarySubtle: '#f9fafb', // secondary subtle
            secondaryMuted: '#f3f4f6', // secondary muted
            secondaryEmphasis: '#374151', // secondary emphasis
            tertiaryHover: '#d1d5db', // tertiary hover
            tertiaryActive: '#9ca3af', // tertiary active
            tertiarySubtle: '#ffffff', // tertiary subtle
            tertiaryMuted: '#f9fafb', // tertiary muted
            tertiaryEmphasis: '#6b7280', // tertiary emphasis
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
            raised: '#ffffff', // raised surface
            overlay: '#ffffff', // overlay surface
            sunken: '#f5f5f5', // sunken surface
            selected: '#eff6ff', // selected surface
            disabled: '#f9fafb', // disabled surface
            muted: '#f5f5f5', // muted surface
            subtle: '#fafafa', // subtle surface
            emphasis: '#e5e5e5', // emphasized surface
        },
        effects: {
            glowPrimary: '0 0 12px rgba(59, 130, 246, 0.5)', // primary glow
            glowSecondary: '0 0 12px rgba(107, 114, 128, 0.3)', // secondary glow
            glowTertiary: '0 0 8px rgba(209, 213, 219, 0.2)', // tertiary glow
            glowFocus: '0 0 8px rgba(59, 130, 246, 0.6)', // focus glow
            glowHover: '0 0 16px rgba(59, 130, 246, 0.3)', // hover glow
            glowActive: '0 0 20px rgba(59, 130, 246, 0.7)', // active glow
            glowSubtle: '0 0 6px rgba(59, 130, 246, 0.2)', // subtle glow
            glowStrong: '0 0 24px rgba(59, 130, 246, 0.8)', // strong glow
            glowBrand: '0 0 12px rgba(59, 130, 246, 0.5)', // brand glow
            glowSuccess: '0 0 12px rgba(16, 185, 129, 0.5)', // success glow
            glowError: '0 0 12px rgba(239, 68, 68, 0.5)', // error glow
            glowWarning: '0 0 12px rgba(245, 158, 11, 0.5)', // warning glow
            glowInfo: '0 0 12px rgba(59, 130, 246, 0.5)', // info glow
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
    duration: {
        instant: '0ms', // instant transition
        fast: '150ms', // fast transition
        normal: '300ms', // normal transition
        slow: '500ms', // slow transition
        slower: '750ms', // slower transition
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
} satisfies Brand['semantic']
