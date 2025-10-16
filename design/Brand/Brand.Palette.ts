import { DeepInvertColorScale } from '@sky-modules/design/Design/InvertColorScale'

import Brand from '.'

export interface AutoDarkConfig {
    enabled: boolean
    invertColors: DeepInvertColorScale<Brand['foundation']['colors']>
    overrides?: {
        semantic?: Partial<Brand['semantic']>
        components?: Partial<Brand['components']>
    }
}

// Palette structure from YourBrand approach
export default interface BrandPalette {
    autoDark?: AutoDarkConfig
    light?: Brand.Theme
    dark?: Brand.Theme
    generateDarkTheme?: (lightTheme: Brand.Palette) => Brand.Palette
}
