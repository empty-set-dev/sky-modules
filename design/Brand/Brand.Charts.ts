/**
 * Data visualization tokens
 *
 * Color palettes and styling specifically for charts and data visualization:
 * - Categorical colors (distinct colors for categories)
 * - Sequential colors (gradients for ordered data)
 * - Diverging colors (two-way gradients from center point)
 * - Qualitative colors (distinct colors without implied order)
 * - Grid, axis, legend, and tooltip styling
 *
 * @example
 * ```typescript
 * const charts: BrandCharts = {
 *   colors: {
 *     categorical: ['blue.500', 'green.500', 'purple.500', 'orange.500'],
 *     sequential: ['blue.100', 'blue.300', 'blue.500', 'blue.700', 'blue.900']
 *   },
 *   grid: {
 *     color: 'gray.200',
 *     strokeWidth: '1px'
 *   }
 * }
 * ```
 */
export default interface BrandCharts {
    colors: {
        categorical: string[]
        sequential: string[]
        diverging: string[]
        qualitative: string[]
    }
    grid: {
        color: string
        strokeWidth: string
        strokeDasharray: string
    }
    axis: {
        color: string
        strokeWidth: string
        fontSize: string
        fontWeight: string
    }
    legend: {
        background: string
        foreground: string
        border: string
        padding: string
        fontSize: string
        spacing: string
    }
    tooltip: {
        background: string
        foreground: string
        border: string
        shadow: string
        padding: string
        fontSize: string
        radius: string
    }
}
