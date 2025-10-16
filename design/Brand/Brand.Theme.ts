import Brand from './Brand'
import BrandPalette, { BrandPaletteTheme } from './Brand.Palette'

// Theme generation modes
export type ThemeMode = 'auto-dark' | 'palette'

// 🌙 Theme support interfaces
export type BrandThemes = Record<string, BrandPaletteTheme>
