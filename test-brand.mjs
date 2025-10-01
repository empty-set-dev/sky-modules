import brand from './examples/universal/brand.ts';
import generateBrandCssVariables from './cli/utilities/generateBrandCssVariables.ts';
import { resolveBrandInheritance } from './cli/utilities/resolveBrandInheritance.ts';

console.log('Brand loaded:', brand.name);
console.log('Extends:', brand.extends?.map(b => b.name));

try {
    const resolved = await resolveBrandInheritance(brand, './examples/universal/brand.ts');
    console.log('Resolved brand name:', resolved.name);

    const result = generateBrandCssVariables(resolved, { minify: true });
    console.log('✅ Success! CSS variables count:', result.stats.variableCount);
    console.log('CSS size:', result.stats.bytes, 'bytes');
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
}