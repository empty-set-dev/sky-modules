// 🎨 Brand Configuration for examples/universal
import reset from '@sky-modules/design/brands/reset.brand'
import sky from '@sky-modules/design/brands/sky.brand'

import type { BrandDescription } from '@sky-modules/design/Brand'

// Customize your brand by extending the reset brand
export default {
    name: 'universal-example-brand',
    extends: [reset, sky],
} satisfies BrandDescription
