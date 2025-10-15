// 🎨 Brand Configuration for playground/universal
import skyBrand from '@sky-modules/design/brands/sky.brand'

import type { BrandDescription } from '@sky-modules/design/Brand'

// Customize your brand by extending the reset brand
export default {
    name: 'sky.playground',
    extends: [skyBrand],
} satisfies BrandDescription
