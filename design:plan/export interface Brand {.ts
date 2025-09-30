export interface Brand {
  // 🎨 Базовые токены
  colors: {
    background: string
    foreground: string
    muted: string
    subtle: string
    border: string
    accent: string
    success: string
    warning: string
    error: string
    info: string
    overlay: string
  }

  typography: {
    fontFamily: {
      sans: string
      serif: string
      mono: string
      display: string
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
    }
    lineHeight: {
      none: string
      tight: string
      snug: string
      normal: string
      relaxed: string
      loose: string
    }
    fontWeight: {
      thin: string
      light: string
      normal: string
      medium: string
      semibold: string
      bold: string
      extrabold: string
      black: string
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

  spacing: {
    none: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }

  radius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }

  shadow: {
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    inner: string
    none: string
  }

  zIndex: {
    auto: string
    base: string
    dropdown: string
    sticky: string
    overlay: string
    modal: string
    popover: string
    tooltip: string
    max: string
  }

  transition: {
    fast: string
    normal: string
    slow: string
  }

  // 📖 Rich-text (prose)
  prose: {
    body: string
    lead: string
    small: string
    muted: string

    heading1: string
    heading2: string
    heading3: string
    heading4: string
    heading5: string
    heading6: string

    link: string
    linkHover: string
    linkVisited: string
    bold: string
    italic: string
    underline: string
    strikethrough: string
    highlight: string
    code: string
    kbd: string
    mark: string
    sub: string
    sup: string

    blockquote: string
    hr: string
    pre: string
    codeBlock: string
    image: string
    figure: string
    figcaption: string
    table: string
    thead: string
    tbody: string
    tr: string
    th: string
    td: string

    ul: string
    ol: string
    li: string
    listMarker: string
    checklist: string

    caption: string
    footnote: string
    citation: string
    annotation: string
  }

  // 🧩 Компоненты
  components: {
    button: {
      background: string
      foreground: string
      hoverBackground: string
      activeBackground: string
      disabledBackground: string
      border: string
      shadow: string
    }

    input: {
      background: string
      foreground: string
      border: string
      placeholder: string
      focusBorder: string
      disabledBackground: string
      errorBorder: string
    }

    textarea: {
      background: string
      foreground: string
      border: string
      placeholder: string
      focusBorder: string
    }

    select: {
      background: string
      foreground: string
      border: string
      placeholder: string
      option: string
      optionHover: string
    }

    checkbox: {
      background: string
      border: string
      checkmark: string
      disabledBackground: string
    }

    radio: {
      background: string
      border: string
      dot: string
    }

    switch: {
      track: string
      trackChecked: string
      thumb: string
      thumbChecked: string
    }

    card: {
      background: string
      foreground: string
      border: string
      shadow: string
      header: string
      footer: string
    }

    tooltip: {
      background: string
      foreground: string
      border: string
      shadow: string
    }

    modal: {
      background: string
      foreground: string
      backdrop: string
      border: string
      shadow: string
      header: string
      footer: string
    }

    popover: {
      background: string
      foreground: string
      border: string
      shadow: string
    }

    dropdown: {
      background: string
      foreground: string
      border: string
      shadow: string
      itemHover: string
      itemActive: string
    }

    navbar: {
      background: string
      foreground: string
      border: string
      shadow: string
    }

    sidebar: {
      background: string
      foreground: string
      border: string
      shadow: string
    }

    table: {
      background: string
      foreground: string
      border: string
      rowHover: string
      headerBackground: string
      headerForeground: string
    }

    tabs: {
      tabBackground: string
      tabForeground: string
      tabActiveBackground: string
      tabActiveForeground: string
      indicator: string
    }

    badge: {
      background: string
      foreground: string
      border: string
    }

    alert: {
      background: string
      foreground: string
      border: string
      icon: string
    }

    toast: {
      background: string
      foreground: string
      border: string
      shadow: string
      success: string
      error: string
      warning: string
      info: string
    }

    progress: {
      track: string
      indicator: string
      label: string
    }

    avatar: {
      background: string
      foreground: string
      border: string
      placeholder: string
    }

    pagination: {
      background: string
      foreground: string
      border: string
      activeBackground: string
      activeForeground: string
    }

    breadcrumb: {
      foreground: string
      separator: string
      hover: string
    }
  }
}
