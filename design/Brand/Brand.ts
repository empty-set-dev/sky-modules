import BrandNamespace from '.'

import type DeepPartial from '@sky-modules/core/utility-types/DeepPartial'

export default interface Brand {
    // 🏷️ Brand identity
    name: string // Brand name for data-brand attribute (e.g., 'sky', 'custom')
    extends?: BrandNamespace.Description[] // Base brand(s) to extend from

    // 🏗️ Foundation - atomic design tokens
    foundation: BrandNamespace.Foundation

    // 🎨 Semantic tokens - role-based tokens
    semantic: BrandNamespace.Semantic

    // 🎭 Component tokens - component-specific styles
    components: BrandNamespace.Components

    // 📊 Data visualization tokens
    charts: BrandNamespace.Charts

    // 📐 Layout system
    layout: BrandNamespace.Layout

    // 🌙 Theme Support - Two approaches
    themes?: BrandNamespace.Themes

    // 🎛️ Theme-aware semantic colors (when themes are enabled)
    themeSemantics?: BrandNamespace.ThemeSemantics
}

export interface BrandDescription extends DeepPartial<Brand> {
    // Override for BrandDescription - name is required
    name: string
}
