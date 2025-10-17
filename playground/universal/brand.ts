// 🎨 Brand Configuration for playground/universal
import Brand from '@sky-modules/design/Brand'
import resetBrand from '@sky-modules/design/brands/reset.brand'

// Customize your brand by extending the reset brand
export default {
    name: 'sky.playground',
    extends: [resetBrand],
} satisfies Brand.Description
