// 🎨 Brand Configuration for playground/universal
import defaultBrand from '@sky-modules/design/brands/default.brand'

import type { BrandDescription } from '@sky-modules/design/Brand'

// Customize your brand by extending the reset brand
export default {
    name: 'universal-example-brand',
    extends: [defaultBrand],
} satisfies BrandDescription
