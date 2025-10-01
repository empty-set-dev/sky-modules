// 🔗 Brand Inheritance Resolver - handles brand extends logic
import type Brand from '@sky-modules/design/Brand'
import type { BrandDescription } from '@sky-modules/design/Brand'

/**
 * Recursively resolves brand inheritance, merging extends chains
 * Supports array extends with Brand objects
 */
export async function resolveBrandInheritance(
    brand: BrandDescription,
    brandPath: string,
    visited = new Set<string>()
): Promise<Brand> {
    // Prevent circular inheritance
    if (visited.has(brandPath)) {
        throw new Error(`Circular inheritance detected: ${brandPath}`)
    }

    visited.add(brandPath)

    if (!brand.extends) {
        // No inheritance, return as-is (but ensure it's a complete Brand)
        return brand as Brand
    }

    // Start with empty base brand
    let resolvedBrand: Record<string, unknown> = {}

    // Resolve each extends in order (later ones override earlier ones)
    if (brand.extends) {
        for (const extendsBrand of brand.extends) {
            // Recursively resolve the base brand's inheritance
            const resolvedExtendsBrand = await resolveBrandInheritance(
                extendsBrand,
                `${brandPath}-extends-${extendsBrand.name}`, // Synthetic path for recursion tracking
                new Set(visited) // Pass copy to avoid interference
            )

            // Deep merge the resolved base brand into our accumulator
            resolvedBrand = deepMergeBrands(resolvedBrand, resolvedExtendsBrand)
        }
    }

    // Finally, merge the current brand on top (without extends to avoid recursion)
    const { extends: _, ...brandWithoutExtends } = brand
    resolvedBrand = deepMergeBrands(resolvedBrand, brandWithoutExtends)

    return resolvedBrand as Brand
}

/**
 * Deep merge two brand objects, with later brands overriding earlier ones
 */
function deepMergeBrands(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
    const result = { ...base }

    for (const [key, value] of Object.entries(override)) {
        if (value === undefined) continue

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Deep merge objects
            result[key] = deepMergeBrands(
                (base[key] as Record<string, unknown>) || {},
                value as Record<string, unknown>
            )
        } else {
            // Direct assignment for primitives, arrays, and null
            result[key] = value
        }
    }

    return result
}