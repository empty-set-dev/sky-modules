export interface SXContextType {
    brand?: string
    mode?: 'light' | 'dark'
    palette?: string
    changeBrand: (design: string) => void
    toggleMode: () => void
    changePalette: (schema: string) => void
}
