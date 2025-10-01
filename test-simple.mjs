import resetBrand from './design/brands/reset.brand.ts';
import skyBrand from './design/brands/sky.brand.ts';

console.log('Reset brand:', resetBrand.name);
console.log('Sky brand:', skyBrand.name);

// Простой тест наследования
const testBrand = {
    name: 'test',
    extends: [resetBrand, skyBrand]
};

console.log('Test brand extends:', testBrand.extends.map(b => b.name));

// Проверим наличие нужных полей
console.log('Reset has semantic.opacity:', !!resetBrand.semantic?.opacity);
console.log('Reset has semantic.animations:', !!resetBrand.semantic?.animations);
console.log('Sky has semantic.opacity:', !!skyBrand.semantic?.opacity);
console.log('Sky has semantic.animations:', !!skyBrand.semantic?.animations);