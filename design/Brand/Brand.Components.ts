// Component type definitions
export interface ButtonVariant {
    background: string
    backgroundHover: string
    backgroundActive: string
    backgroundDisabled: string
    foreground: string
    foregroundDisabled: string
    border: string
    borderHover: string
    borderActive: string
    shadow: string
    shadowHover: string
}

export interface ButtonSize {
    height: string
    padding: string
    fontSize: string
    iconSize: string
}

export interface InputComponent {
    background: string
    backgroundHover: string
    backgroundFocus: string
    backgroundDisabled: string
    foreground: string
    foregroundPlaceholder: string
    foregroundDisabled: string
    border: string
    borderHover: string
    borderFocus: string
    borderError: string
    borderSuccess: string
    borderDisabled: string
    shadow: string
    shadowFocus: string
    iconColor: string
    iconColorDisabled: string
}

export interface TextareaComponent extends InputComponent {
    resize: 'none' | 'vertical' | 'horizontal' | 'both'
}

export interface SelectComponent extends InputComponent {
    icon: string
    iconDisabled: string
    dropdown: {
        background: string
        border: string
        shadow: string
        maxHeight: string
    }
    option: {
        background: string
        backgroundHover: string
        backgroundSelected: string
        foreground: string
        foregroundSelected: string
    }
}

export interface CheckboxComponent {
    background: string
    backgroundChecked: string
    backgroundDisabled: string
    border: string
    borderChecked: string
    borderDisabled: string
    checkmark: string
    checkmarkDisabled: string
    shadow: string
    shadowFocus: string
}

export interface RadioComponent {
    background: string
    backgroundChecked: string
    backgroundDisabled: string
    border: string
    borderChecked: string
    borderDisabled: string
    dot: string
    dotDisabled: string
    shadow: string
    shadowFocus: string
}

export interface SwitchComponent {
    track: string
    trackChecked: string
    trackDisabled: string
    thumb: string
    thumbChecked: string
    thumbDisabled: string
    shadow: string
    shadowFocus: string
}

export interface CardComponent {
    background: string
    backgroundHover: string
    foreground: string
    border: string
    borderHover: string
    shadow: string
    shadowHover: string
    radius: string
    padding: string
    header: ComponentSection
    footer: ComponentSection
}

export interface ComponentSection {
    background: string
    foreground: string
    border: string
    padding: string
}

export interface ModalComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    backdrop: string
    backdropBlur: string
    maxWidth: string
    padding: string
    header: ComponentSection
    footer: ComponentSection
}

export interface PopoverComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    padding: string
    arrow: {
        size: string
        color: string
    }
}

export interface TooltipComponent extends PopoverComponent {
    fontSize: string
    maxWidth: string
}

export interface DropdownComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    maxHeight: string
    item: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        padding: string
        fontSize: string
    }
    separator: {
        color: string
        margin: string
    }
}

export interface NavbarComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    height: string
    padding: string
    logo: {
        height: string
        width: string
    }
    link: {
        foreground: string
        foregroundHover: string
        foregroundActive: string
        padding: string
    }
}

export interface SidebarComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    width: string
    padding: string
    item: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        padding: string
        radius: string
    }
}

export interface BreadcrumbComponent {
    foreground: string
    foregroundHover: string
    foregroundActive: string
    separator: string
    separatorColor: string
    fontSize: string
    spacing: string
}

export interface TableComponent {
    background: string
    foreground: string
    border: string
    radius: string
    header: {
        background: string
        foreground: string
        border: string
        fontWeight: string
        fontSize: string
        padding: string
    }
    row: {
        background: string
        backgroundHover: string
        backgroundSelected: string
        border: string
    }
    cell: {
        padding: string
        fontSize: string
        lineHeight: string
    }
}

export interface AlertComponent {
    variants: {
        info: AlertVariant
        success: AlertVariant
        warning: AlertVariant
        error: AlertVariant
    }
    padding: string
    radius: string
    fontSize: string
    iconSize: string
}

export interface AlertVariant {
    background: string
    foreground: string
    border: string
    icon: string
}

export interface ToastComponent {
    background: string
    foreground: string
    border: string
    shadow: string
    radius: string
    padding: string
    fontSize: string
    maxWidth: string
    variants: {
        success: AlertVariant
        error: AlertVariant
        warning: AlertVariant
        info: AlertVariant
    }
}

export interface ProgressComponent {
    track: string
    indicator: string
    label: string
    height: string
    radius: string
    animation: string
}

export interface SpinnerComponent {
    color: string
    size: string
    strokeWidth: string
    animation: string
}

export interface BadgeComponent {
    variants: {
        default: AlertVariant
        secondary: AlertVariant
        success: AlertVariant
        error: AlertVariant
        warning: AlertVariant
        info: AlertVariant
    }
    sizes: {
        sm: ButtonSize
        md: ButtonSize
        lg: ButtonSize
    }
    radius: string
}

export interface AvatarComponent {
    background: string
    foreground: string
    border: string
    placeholder: string
    sizes: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        '2xl': string
    }
    radius: string
}

export interface TabsComponent {
    background: string
    foreground: string
    border: string
    tab: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        border: string
        borderActive: string
        padding: string
        fontSize: string
    }
    content: {
        background: string
        padding: string
    }
    indicator: {
        color: string
        height: string
    }
}

export interface PaginationComponent {
    background: string
    foreground: string
    border: string
    item: {
        background: string
        backgroundHover: string
        backgroundActive: string
        foreground: string
        foregroundActive: string
        border: string
        borderActive: string
        padding: string
        fontSize: string
        minWidth: string
    }
    gap: string
}

export interface ProseComponent {
    // Base prose styles
    maxWidth: string
    color: string
    fontSize: string
    lineHeight: string
    fontFamily: string

    // Headings
    h1: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h2: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h3: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h4: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h5: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    h6: {
        color: string
        fontSize: string
        fontWeight: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }

    // Text elements
    p: {
        marginTop: string
        marginBottom: string
    }
    lead: {
        color: string
        fontSize: string
        lineHeight: string
        marginTop: string
        marginBottom: string
    }
    strong: {
        color: string
        fontWeight: string
    }
    em: {
        color: string
        fontStyle: string
    }

    // Links
    a: {
        color: string
        textDecoration: string
        fontWeight: string
    }
    'a:hover': {
        color: string
        textDecoration: string
    }

    // Lists
    ul: {
        listStyleType: string
        marginTop: string
        marginBottom: string
        paddingLeft: string
    }
    ol: {
        listStyleType: string
        marginTop: string
        marginBottom: string
        paddingLeft: string
    }
    li: {
        marginTop: string
        marginBottom: string
    }

    // Code
    code: {
        color: string
        backgroundColor: string
        fontFamily: string
        fontSize: string
        fontWeight: string
        padding: string
        borderRadius: string
    }
    pre: {
        color: string
        backgroundColor: string
        fontFamily: string
        fontSize: string
        lineHeight: string
        marginTop: string
        marginBottom: string
        padding: string
        borderRadius: string
        overflowX: string
    }
    'pre code': {
        backgroundColor: string
        color: string
        fontSize: string
        fontWeight: string
        padding: string
    }

    // Blockquotes
    blockquote: {
        fontWeight: string
        fontStyle: string
        color: string
        borderLeft: string
        borderColor: string
        quotes: string
        marginTop: string
        marginBottom: string
        paddingLeft: string
    }
    'blockquote p:first-of-type::before': {
        content: string
    }
    'blockquote p:last-of-type::after': {
        content: string
    }

    // Tables
    table: {
        width: string
        tableLayout: string
        textAlign: string
        marginTop: string
        marginBottom: string
        fontSize: string
        lineHeight: string
    }
    thead: {
        borderBottomWidth: string
        borderBottomColor: string
    }
    'thead th': {
        color: string
        fontWeight: string
        verticalAlign: string
        paddingRight: string
        paddingBottom: string
        paddingLeft: string
    }
    'tbody tr': {
        borderBottomWidth: string
        borderBottomColor: string
    }
    'tbody td': {
        verticalAlign: string
        paddingTop: string
        paddingRight: string
        paddingBottom: string
        paddingLeft: string
    }

    // Images & Media
    img: {
        marginTop: string
        marginBottom: string
    }
    video: {
        marginTop: string
        marginBottom: string
    }
    figure: {
        marginTop: string
        marginBottom: string
    }
    'figure > *': {
        marginTop: string
        marginBottom: string
    }
    figcaption: {
        color: string
        fontSize: string
        lineHeight: string
        marginTop: string
    }

    // Horizontal rules
    hr: {
        borderColor: string
        borderTopWidth: string
        marginTop: string
        marginBottom: string
    }

    // Size variants
    sm: {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }
    lg: {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }
    xl: {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }
    '2xl': {
        fontSize: string
        lineHeight: string
        p: { marginTop: string; marginBottom: string }
        h1: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h2: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h3: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h4: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h5: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        h6: { fontSize: string; marginTop: string; marginBottom: string; lineHeight: string }
        code: { fontSize: string }
        pre: {
            fontSize: string
            lineHeight: string
            marginTop: string
            marginBottom: string
            borderRadius: string
            padding: string
        }
    }

    // Color variants
    invert: {
        color: string
        a: { color: string }
        strong: { color: string }
        code: { color: string; backgroundColor: string }
        pre: { color: string; backgroundColor: string }
        'pre code': { color: string }
        blockquote: { borderColor: string; color: string }
        'thead th': { color: string }
        'tbody tr': { borderBottomColor: string }
        hr: { borderColor: string }
        h1: { color: string }
        h2: { color: string }
        h3: { color: string }
        h4: { color: string }
        h5: { color: string }
        h6: { color: string }
        figcaption: { color: string }
        lead: { color: string }
    }
}

// 🎭 Component tokens - component-specific styles
export default interface BrandComponents {
    button: {
        variants: {
            primary: ButtonVariant
            secondary: ButtonVariant
            tertiary: ButtonVariant
            destructive: ButtonVariant
            ghost: ButtonVariant
        }
        sizes: {
            xs: ButtonSize
            sm: ButtonSize
            md: ButtonSize
            lg: ButtonSize
            xl: ButtonSize
        }
    }
    input: InputComponent
    textarea: TextareaComponent
    select: SelectComponent
    checkbox: CheckboxComponent
    radio: RadioComponent
    switch: SwitchComponent
    card: CardComponent
    modal: ModalComponent
    popover: PopoverComponent
    tooltip: TooltipComponent
    dropdown: DropdownComponent
    navbar: NavbarComponent
    sidebar: SidebarComponent
    breadcrumb: BreadcrumbComponent
    table: TableComponent
    alert: AlertComponent
    toast: ToastComponent
    progress: ProgressComponent
    spinner: SpinnerComponent
    badge: BadgeComponent
    avatar: AvatarComponent
    tabs: TabsComponent
    pagination: PaginationComponent
    prose: ProseComponent
}
