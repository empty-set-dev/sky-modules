import { useContext } from '@builder.io/mitosis'

import { DesignSystemContext, DesignSystemContextType } from './index.lite'

/**
 * Access design system context
 *
 * Hook to access current design system state and actions for brand,
 * theme, and palette management.
 *
 * Must be used within a DesignSystemProvider.
 *
 * @returns Design system context with state and actions
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, toggleTheme } = useDesignSystem()
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current: {theme}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * function BrandSwitcher() {
 *   const { brand, changeBrand } = useDesignSystem()
 *
 *   return (
 *     <select value={brand} onChange={(e) => changeBrand(e.target.value)}>
 *       <option value="sky">Sky</option>
 *       <option value="custom">Custom</option>
 *     </select>
 *   )
 * }
 * ```
 */
export default function useDesignSystem(): DesignSystemContextType {
    return useContext(DesignSystemContext) as DesignSystemContextType
}
