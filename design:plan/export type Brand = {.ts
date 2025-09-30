export type Brand = {

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
