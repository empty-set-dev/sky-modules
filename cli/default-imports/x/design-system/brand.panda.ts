import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  "preflight": false,
  "jsxFramework": "react",
  "include": [
    "**/*.{js,jsx,ts,tsx}"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/.dev/**"
  ],
  "outdir": "x/design-system/panda",
  "watch": true,
  "theme": {
    "tokens": {
      "colors": {
        "neutral": {
          "50": {
            "value": "#fafafa"
          },
          "100": {
            "value": "#f5f5f5"
          },
          "200": {
            "value": "#e5e5e5"
          },
          "300": {
            "value": "#d4d4d4"
          },
          "400": {
            "value": "#a3a3a3"
          },
          "500": {
            "value": "#737373"
          },
          "600": {
            "value": "#525252"
          },
          "700": {
            "value": "#404040"
          },
          "800": {
            "value": "#262626"
          },
          "900": {
            "value": "#171717"
          },
          "950": {
            "value": "#0a0a0a"
          }
        },
        "brand": {
          "primary": {
            "50": {
              "value": "#eefdfd"
            },
            "100": {
              "value": "#d3fafa"
            },
            "200": {
              "value": "#b2f4f5"
            },
            "300": {
              "value": "#74e9ec"
            },
            "400": {
              "value": "#34d5dc"
            },
            "500": {
              "value": "#18b8c2"
            },
            "600": {
              "value": "#1794a3"
            },
            "700": {
              "value": "#197785"
            },
            "800": {
              "value": "#1d616d"
            },
            "900": {
              "value": "#1d515c"
            },
            "950": {
              "value": "#0d353f"
            }
          }
        }
      },
      "spacing": {
        "xs": {
          "value": "0.25rem"
        },
        "sm": {
          "value": "0.5rem"
        },
        "md": {
          "value": "1rem"
        },
        "lg": {
          "value": "1.5rem"
        },
        "xl": {
          "value": "2rem"
        },
        "2xl": {
          "value": "3rem"
        },
        "3xl": {
          "value": "4.5rem"
        },
        "4xl": {
          "value": "6rem"
        },
        "5xl": {
          "value": "9rem"
        },
        "6xl": {
          "value": "12rem"
        },
        "7xl": {
          "value": "18rem"
        },
        "8xl": {
          "value": "24rem"
        },
        "9xl": {
          "value": "32rem"
        }
      },
      "fontSizes": {
        "xs": {
          "value": "0.75rem"
        },
        "sm": {
          "value": "0.875rem"
        },
        "md": {
          "value": "1rem"
        },
        "lg": {
          "value": "1.125rem"
        },
        "xl": {
          "value": "1.25rem"
        },
        "2xl": {
          "value": "1.5rem"
        },
        "3xl": {
          "value": "1.875rem"
        },
        "4xl": {
          "value": "2.25rem"
        },
        "5xl": {
          "value": "3rem"
        },
        "6xl": {
          "value": "3.75rem"
        },
        "7xl": {
          "value": "4.5rem"
        },
        "8xl": {
          "value": "6rem"
        },
        "9xl": {
          "value": "8rem"
        }
      },
      "fontWeights": {},
      "lineHeights": {
        "xs": {
          "value": "1rem"
        },
        "sm": {
          "value": "1.25rem"
        },
        "md": {
          "value": "1.5rem"
        },
        "lg": {
          "value": "1.75rem"
        },
        "xl": {
          "value": "1.875rem"
        },
        "2xl": {
          "value": "2rem"
        },
        "3xl": {
          "value": "2.25rem"
        },
        "4xl": {
          "value": "2.5rem"
        },
        "5xl": {
          "value": "3rem"
        },
        "6xl": {
          "value": "3.75rem"
        },
        "7xl": {
          "value": "4.5rem"
        },
        "8xl": {
          "value": "6rem"
        },
        "9xl": {
          "value": "8rem"
        },
        "tight": {
          "value": "1.25"
        },
        "snug": {
          "value": "1.375"
        },
        "normal": {
          "value": "1.5"
        },
        "relaxed": {
          "value": "1.625"
        },
        "loose": {
          "value": "2"
        }
      },
      "letterSpacings": {
        "tighter": {
          "value": "-0.05em"
        },
        "tight": {
          "value": "-0.025em"
        },
        "normal": {
          "value": "0em"
        },
        "wide": {
          "value": "0.025em"
        },
        "wider": {
          "value": "0.05em"
        },
        "widest": {
          "value": "0.1em"
        }
      },
      "radii": {
        "xs": {
          "value": "0.125rem"
        },
        "sm": {
          "value": "0.25rem"
        },
        "md": {
          "value": "0.375rem"
        },
        "lg": {
          "value": "0.5rem"
        },
        "xl": {
          "value": "0.75rem"
        },
        "2xl": {
          "value": "1rem"
        },
        "3xl": {
          "value": "1.5rem"
        },
        "full": {
          "value": "9999px"
        }
      },
      "shadows": {
        "xs": {
          "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        },
        "sm": {
          "value": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        },
        "md": {
          "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        },
        "lg": {
          "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        },
        "xl": {
          "value": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        },
        "2xl": {
          "value": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        },
        "3xl": {
          "value": "0 35px 60px -12px rgba(0, 0, 0, 0.35)"
        }
      },
      "blurs": {
        "xs": {
          "value": "2px"
        },
        "sm": {
          "value": "4px"
        },
        "md": {
          "value": "8px"
        },
        "lg": {
          "value": "16px"
        },
        "xl": {
          "value": "24px"
        },
        "2xl": {
          "value": "40px"
        },
        "3xl": {
          "value": "64px"
        }
      },
      "sizes": {
        "xs": {
          "value": "1.25rem"
        },
        "sm": {
          "value": "2rem"
        },
        "md": {
          "value": "2.5rem"
        },
        "lg": {
          "value": "3rem"
        },
        "xl": {
          "value": "4rem"
        },
        "2xl": {
          "value": "5rem"
        },
        "3xl": {
          "value": "6rem"
        },
        "4xl": {
          "value": "8rem"
        },
        "5xl": {
          "value": "10rem"
        },
        "6xl": {
          "value": "14rem"
        },
        "7xl": {
          "value": "18rem"
        },
        "8xl": {
          "value": "24rem"
        },
        "9xl": {
          "value": "32rem"
        }
      },
      "zIndex": {
        "dropdown": {
          "value": 100
        },
        "sticky": {
          "value": 200
        },
        "fixed": {
          "value": 300
        },
        "modal": {
          "value": 400
        },
        "popover": {
          "value": 500
        },
        "tooltip": {
          "value": 600
        },
        "toast": {
          "value": 700
        },
        "overlay": {
          "value": 800
        }
      },
      "durations": {
        "instant": {
          "value": "0ms"
        },
        "micro": {
          "value": "75ms"
        },
        "short": {
          "value": "150ms"
        },
        "base": {
          "value": "200ms"
        },
        "moderate": {
          "value": "300ms"
        },
        "long": {
          "value": "500ms"
        },
        "extended": {
          "value": "800ms"
        }
      },
      "opacity": {
        "disabled": {
          "value": "0.5"
        },
        "subtle": {
          "value": "0.8"
        },
        "medium": {
          "value": "0.6"
        },
        "visible": {
          "value": "1"
        },
        "hidden": {
          "value": "0"
        },
        "overlay": {
          "value": "0.9"
        },
        "backdrop": {
          "value": "0.5"
        }
      }
    },
    "semanticTokens": {
      "colors": {
        "background": {
          "primary": {
            "value": "#ffffff"
          },
          "secondary": {
            "value": "#fafafa"
          },
          "tertiary": {
            "value": "#f5f5f5"
          },
          "inverse": {
            "value": "#171717"
          },
          "backdrop": {
            "value": "rgba(0, 0, 0, 0.5)"
          },
          "overlay": {
            "value": "rgba(0, 0, 0, 0.1)"
          },
          "scrim": {
            "value": "rgba(0, 0, 0, 0.8)"
          }
        },
        "foreground": {
          "primary": {
            "value": "#171717"
          },
          "secondary": {
            "value": "#525252"
          },
          "tertiary": {
            "value": "#737373"
          },
          "inverse": {
            "value": "#ffffff"
          },
          "disabled": {
            "value": "#a3a3a3"
          },
          "placeholder": {
            "value": "#a3a3a3"
          }
        },
        "border": {
          "primary": {
            "value": "#e5e5e5"
          },
          "secondary": {
            "value": "#d4d4d4"
          },
          "tertiary": {
            "value": "#a3a3a3"
          },
          "inverse": {
            "value": "#404040"
          },
          "focus": {
            "value": "#18b8c2"
          },
          "error": {
            "value": "#ef4444"
          },
          "warning": {
            "value": "#f59e0b"
          },
          "success": {
            "value": "#10b981"
          },
          "info": {
            "value": "#18b8c2"
          }
        },
        "brand": {
          "primaryHover": {
            "value": "#18b8c2"
          },
          "primaryActive": {
            "value": "#1794a3"
          },
          "primarySubtle": {
            "value": "#eefdfd"
          },
          "primaryMuted": {
            "value": "#d3fafa"
          },
          "primaryEmphasis": {
            "value": "#197785"
          },
          "secondaryHover": {
            "value": "#34d5dc"
          },
          "secondaryActive": {
            "value": "#74e9ec"
          },
          "secondarySubtle": {
            "value": "#b2f4f5"
          },
          "secondaryMuted": {
            "value": "#eefdfd"
          },
          "secondaryEmphasis": {
            "value": "#1d616d"
          },
          "tertiaryHover": {
            "value": "#b2f4f5"
          },
          "tertiaryActive": {
            "value": "#74e9ec"
          },
          "tertiarySubtle": {
            "value": "#eefdfd"
          },
          "tertiaryMuted": {
            "value": "#d3fafa"
          },
          "tertiaryEmphasis": {
            "value": "#1d515c"
          }
        },
        "status": {
          "success": {
            "value": "#10b981"
          },
          "successHover": {
            "value": "#059669"
          },
          "successActive": {
            "value": "#047857"
          },
          "successSubtle": {
            "value": "#ecfdf5"
          },
          "successMuted": {
            "value": "#d1fae5"
          },
          "successEmphasis": {
            "value": "#065f46"
          },
          "error": {
            "value": "#ef4444"
          },
          "errorHover": {
            "value": "#dc2626"
          },
          "errorActive": {
            "value": "#b91c1c"
          },
          "errorSubtle": {
            "value": "#fef2f2"
          },
          "errorMuted": {
            "value": "#fecaca"
          },
          "errorEmphasis": {
            "value": "#991b1b"
          },
          "warning": {
            "value": "#f59e0b"
          },
          "warningHover": {
            "value": "#d97706"
          },
          "warningActive": {
            "value": "#b45309"
          },
          "warningSubtle": {
            "value": "#fffbeb"
          },
          "warningMuted": {
            "value": "#fed7aa"
          },
          "warningEmphasis": {
            "value": "#92400e"
          },
          "info": {
            "value": "#3b82f6"
          },
          "infoHover": {
            "value": "#2563eb"
          },
          "infoActive": {
            "value": "#1d4ed8"
          },
          "infoSubtle": {
            "value": "#eff6ff"
          },
          "infoMuted": {
            "value": "#dbeafe"
          },
          "infoEmphasis": {
            "value": "#1e40af"
          }
        },
        "surface": {
          "overlay": {
            "value": "#ffffff"
          },
          "selected": {
            "value": "#eefdfd"
          },
          "disabled": {
            "value": "#f9fafb"
          }
        },
        "effects": {
          "glowPrimary": {
            "value": "0 0 12px rgba(24, 184, 194, 0.5)"
          },
          "glowSecondary": {
            "value": "0 0 12px rgba(52, 213, 220, 0.3)"
          },
          "glowTertiary": {
            "value": "0 0 8px rgba(116, 233, 236, 0.2)"
          },
          "glowFocus": {
            "value": "0 0 8px rgba(24, 184, 194, 0.6)"
          },
          "glowHover": {
            "value": "0 0 16px rgba(24, 184, 194, 0.3)"
          },
          "glowActive": {
            "value": "0 0 20px rgba(23, 148, 163, 0.7)"
          },
          "glowSubtle": {
            "value": "0 0 6px rgba(116, 233, 236, 0.2)"
          },
          "glowStrong": {
            "value": "0 0 24px rgba(24, 184, 194, 0.8)"
          },
          "glowBrand": {
            "value": "0 0 12px rgba(24, 184, 194, 0.5)"
          },
          "glowSuccess": {
            "value": "0 0 12px rgba(16, 185, 129, 0.5)"
          },
          "glowError": {
            "value": "0 0 12px rgba(239, 68, 68, 0.5)"
          },
          "glowWarning": {
            "value": "0 0 12px rgba(245, 158, 11, 0.5)"
          },
          "glowInfo": {
            "value": "0 0 12px rgba(24, 184, 194, 0.5)"
          }
        }
      }
    }
  }
})
