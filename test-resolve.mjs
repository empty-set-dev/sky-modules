import resetBrand from './design/brands/reset.brand.ts';
import skyBrand from './design/brands/sky.brand.ts';

// Симулируем brand из examples/universal/brand.ts
const testBrand = {
    name: 'brand',
    extends: [resetBrand, skyBrand]
};

console.log('Test brand:', testBrand.name);
console.log('Extends:', testBrand.extends.map(b => b.name));

// Простое наследование вместо resolveBrandInheritance
function simpleMerge(brand) {
    let result = { ...brand };

    if (brand.extends) {
        // Для каждого extends-а мержим его содержимое
        for (const extendsBrand of brand.extends) {
            const resolved = simpleMerge(extendsBrand);

            // Простое слияние - берём поля из extends если они отсутствуют
            if (!result.foundation && resolved.foundation) {
                result.foundation = resolved.foundation;
            }
            if (!result.semantic && resolved.semantic) {
                result.semantic = resolved.semantic;
            }
            if (!result.global && resolved.global) {
                result.global = resolved.global;
            }
            if (!result.components && resolved.components) {
                result.components = resolved.components;
            }
            if (!result.charts && resolved.charts) {
                result.charts = resolved.charts;
            }
            if (!result.layout && resolved.layout) {
                result.layout = resolved.layout;
            }
        }

        // Убираем extends из финального результата
        delete result.extends;
    }

    return result;
}

try {
    const resolved = simpleMerge(testBrand);
    console.log('✅ Resolved brand name:', resolved.name);
    console.log('Has foundation:', !!resolved.foundation);
    console.log('Has semantic:', !!resolved.semantic);
    console.log('Has semantic.opacity:', !!resolved.semantic?.opacity);
    console.log('Has semantic.animations:', !!resolved.semantic?.animations);

    // Попробуем с generateBrandCssVariables
    const { default: generateBrandCssVariables } = await import('./cli/utilities/generateBrandCssVariables.ts');

    const result = generateBrandCssVariables(resolved, { minify: true });
    console.log('✅ SUCCESS! CSS variables count:', result.stats.variableCount);
    console.log('CSS size:', result.stats.bytes, 'bytes');

} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
}