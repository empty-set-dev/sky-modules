export type Brand = {
  // 🎨 Цвета
  colors: {
    // Основные роли
    background: string
    foreground: string
    border: string
    ring: string
    overlay: string

    // Палитры по уровню акцента
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    tertiary: string
    tertiaryForeground: string
    accent: string
    accentForeground: string

    // Статусы
    success: string
    successForeground: string
    warning: string
    warningForeground: string
    error: string
    errorForeground: string
    info: string
    infoForeground: string

    // Нейтральные
    muted: string
    mutedForeground: string
    subtle: string
    subtleForeground: string
    disabled: string
    disabledForeground: string

    // Поверхности / elevation
    surface: string
    surfaceHover: string
    surfaceActive: string
    surfaceSelected: string
    surfaceInverse: string

    // Тени/подложки
    backdrop: string
    scrim: string
  }

  // 🖋️ Типографика
  typography: {
    fontFamily: {
      body: string
      heading: string
      mono: string
      display?: string
    }
    fontSize: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
      '5xl': string
      '6xl': string
    }
    fontWeight: {
      thin: number
      light: number
      normal: number
      medium: number
      semibold: number
      bold: number
      extrabold: number
      black: number
    }
    lineHeight: {
      none: string
      tight: string
      snug: string
      normal: string
      relaxed: string
      loose: string
    }
    letterSpacing: {
      tighter: string
      tight: string
      normal: string
      wide: string
      wider: string
      widest: string
    }
  }

  // 📏 Размеры и layout
  spacing: {
    px: string
    '0': string
    '0.5': string
    '1': string
    '1.5': string
    '2': string
    '2.5': string
    '3': string
    '4': string
    '5': string
    '6': string
    '8': string
    '10': string
    '12': string
    '16': string
    '20': string
    '24': string
    '32': string
    '40': string
    '48': string
    '56': string
    '64': string
  }

  radius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    full: string
  }

  shadow: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    inner: string
    none: string
  }

  zIndex: {
    auto: string | number
    base: string | number
    docked: string | number
    dropdown: string | number
    sticky: string | number
    banner: string | number
    overlay: string | number
    modal: string | number
    popover: string | number
    skipLink: string | number
    toast: string | number
    tooltip: string | number
  }

  // ⚡ Motion
  transition: {
    durations: {
      fast: string
      normal: string
      slow: string
    }
    timingFunctions: {
      easeIn: string
      easeOut: string
      easeInOut: string
      linear: string
    }
  }

  animation: {
    fadeIn: string
    fadeOut: string
    slideIn: string
    slideOut: string
    bounce: string
    spin: string
    pulse: string
  }

  // ✍️ Prose (rich text / markdown)
  prose: {
    body: string
    heading: string
    lead: string
    link: string
    linkHover: string
    bold: string
    italic: string
    code: string
    pre: string
    quote: string
    hr: string
    listMarker: string
    caption: string
    table: string
    thead: string
    tbody: string
  }

  // 🧩 Components slots (семантическая настройка под UI primitives)
  components?: {
    button: {
      background: string
      foreground: string
      hoverBackground: string
      activeBackground: string
      disabledBackground: string
    }
    input: {
      background: string
      foreground: string
      border: string
      placeholder: string
    }
    card: {
      background: string
      foreground: string
      border: string
      shadow: string
    }
    tooltip: {
      background: string
      foreground: string
    }
    modal: {
      background: string
      foreground: string
      backdrop: string
    }
  }
}
