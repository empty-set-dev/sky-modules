export default {
  "preflight": false,
  "jsxFramework": "react",
  "include": [
    "**/*.{js,jsx,ts,tsx}"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/.dev/**"
  ],
  "outdir": "styled-system",
  "watch": true,
  
  "tokens": {
    "colors": {
      "neutral": {
        "50": "#fafafa",
        "100": "#f5f5f5",
        "200": "#e5e5e5",
        "300": "#d4d4d4",
        "400": "#a3a3a3",
        "500": "#737373",
        "600": "#525252",
        "700": "#404040",
        "800": "#262626",
        "900": "#171717",
        "950": "#0a0a0a"
      },
      "brand": {
        "primary": {
          "50": "#eefdfd",
          "100": "#d3fafa",
          "200": "#b2f4f5",
          "300": "#74e9ec",
          "400": "#34d5dc",
          "500": "#18b8c2",
          "600": "#1794a3",
          "700": "#197785",
          "800": "#1d616d",
          "900": "#1d515c",
          "950": "#0d353f"
        }
      }
    },
    "spacing": {
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem",
      "2xl": "3rem",
      "3xl": "4.5rem",
      "4xl": "6rem",
      "5xl": "9rem",
      "6xl": "12rem",
      "7xl": "18rem",
      "8xl": "24rem",
      "9xl": "32rem"
    },
    "fontSizes": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "md": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem"
    },
    "fontWeights": {},
    "lineHeights": {
      "xs": "1rem",
      "sm": "1.25rem",
      "md": "1.5rem",
      "lg": "1.75rem",
      "xl": "1.875rem",
      "2xl": "2rem",
      "3xl": "2.25rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
      "tight": "1.25",
      "snug": "1.375",
      "normal": "1.5",
      "relaxed": "1.625",
      "loose": "2"
    },
    "letterSpacings": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0em",
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    },
    "radii": {
      "xs": "0.125rem",
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      "full": "9999px"
    },
    "shadows": {
      "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.35)"
    },
    "blurs": {
      "xs": "2px",
      "sm": "4px",
      "md": "8px",
      "lg": "16px",
      "xl": "24px",
      "2xl": "40px",
      "3xl": "64px"
    },
    "sizes": {
      "xs": "1.25rem",
      "sm": "2rem",
      "md": "2.5rem",
      "lg": "3rem",
      "xl": "4rem",
      "2xl": "5rem",
      "3xl": "6rem",
      "4xl": "8rem",
      "5xl": "10rem",
      "6xl": "14rem",
      "7xl": "18rem",
      "8xl": "24rem",
      "9xl": "32rem"
    },
    "zIndex": {
      "dropdown": 100,
      "sticky": 200,
      "fixed": 300,
      "modal": 400,
      "popover": 500,
      "tooltip": 600,
      "toast": 700,
      "overlay": 800
    },
    "durations": {
      "instant": "0ms",
      "micro": "75ms",
      "short": "150ms",
      "base": "200ms",
      "moderate": "300ms",
      "long": "500ms",
      "extended": "800ms"
    },
    "opacity": {
      "disabled": "0.5",
      "subtle": "0.8",
      "medium": "0.6",
      "visible": "1",
      "hidden": "0",
      "overlay": "0.9",
      "backdrop": "0.5"
    }
  },
  "semanticTokens": {
    "colors": {
      "background": {
        "primary": "#ffffff",
        "secondary": "#fafafa",
        "tertiary": "#f5f5f5",
        "inverse": "#171717",
        "backdrop": "rgba(0, 0, 0, 0.5)",
        "overlay": "rgba(0, 0, 0, 0.1)",
        "scrim": "rgba(0, 0, 0, 0.8)"
      },
      "foreground": {
        "primary": "#171717",
        "secondary": "#525252",
        "tertiary": "#737373",
        "inverse": "#ffffff",
        "disabled": "#a3a3a3",
        "placeholder": "#a3a3a3"
      },
      "border": {
        "primary": "#e5e5e5",
        "secondary": "#d4d4d4",
        "tertiary": "#a3a3a3",
        "inverse": "#404040",
        "focus": "#18b8c2",
        "error": "#ef4444",
        "warning": "#f59e0b",
        "success": "#10b981",
        "info": "#18b8c2"
      },
      "brand": {
        "primaryHover": "#18b8c2",
        "primaryActive": "#1794a3",
        "primarySubtle": "#eefdfd",
        "primaryMuted": "#d3fafa",
        "primaryEmphasis": "#197785",
        "secondaryHover": "#34d5dc",
        "secondaryActive": "#74e9ec",
        "secondarySubtle": "#b2f4f5",
        "secondaryMuted": "#eefdfd",
        "secondaryEmphasis": "#1d616d",
        "tertiaryHover": "#b2f4f5",
        "tertiaryActive": "#74e9ec",
        "tertiarySubtle": "#eefdfd",
        "tertiaryMuted": "#d3fafa",
        "tertiaryEmphasis": "#1d515c"
      },
      "status": {
        "success": "#10b981",
        "successHover": "#059669",
        "successActive": "#047857",
        "successSubtle": "#ecfdf5",
        "successMuted": "#d1fae5",
        "successEmphasis": "#065f46",
        "error": "#ef4444",
        "errorHover": "#dc2626",
        "errorActive": "#b91c1c",
        "errorSubtle": "#fef2f2",
        "errorMuted": "#fecaca",
        "errorEmphasis": "#991b1b",
        "warning": "#f59e0b",
        "warningHover": "#d97706",
        "warningActive": "#b45309",
        "warningSubtle": "#fffbeb",
        "warningMuted": "#fed7aa",
        "warningEmphasis": "#92400e",
        "info": "#3b82f6",
        "infoHover": "#2563eb",
        "infoActive": "#1d4ed8",
        "infoSubtle": "#eff6ff",
        "infoMuted": "#dbeafe",
        "infoEmphasis": "#1e40af"
      },
      "surface": {
        "overlay": "#ffffff",
        "selected": "#eefdfd",
        "disabled": "#f9fafb"
      },
      "effects": {
        "glowPrimary": "0 0 12px rgba(24, 184, 194, 0.5)",
        "glowSecondary": "0 0 12px rgba(52, 213, 220, 0.3)",
        "glowTertiary": "0 0 8px rgba(116, 233, 236, 0.2)",
        "glowFocus": "0 0 8px rgba(24, 184, 194, 0.6)",
        "glowHover": "0 0 16px rgba(24, 184, 194, 0.3)",
        "glowActive": "0 0 20px rgba(23, 148, 163, 0.7)",
        "glowSubtle": "0 0 6px rgba(116, 233, 236, 0.2)",
        "glowStrong": "0 0 24px rgba(24, 184, 194, 0.8)",
        "glowBrand": "0 0 12px rgba(24, 184, 194, 0.5)",
        "glowSuccess": "0 0 12px rgba(16, 185, 129, 0.5)",
        "glowError": "0 0 12px rgba(239, 68, 68, 0.5)",
        "glowWarning": "0 0 12px rgba(245, 158, 11, 0.5)",
        "glowInfo": "0 0 12px rgba(24, 184, 194, 0.5)"
      }
    }
  }
}