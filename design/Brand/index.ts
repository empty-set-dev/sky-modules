import Brand, { BrandDescription } from './Brand'
import BrandCharts from './Brand.Charts'
import BrandComponents from './Brand.Components'
import BrandFoundation from './Brand.Foundation'
import BrandLayout from './Brand.Layout'
import BrandPalette from './Brand.Palette'
import BrandSemantic from './Brand.Semantic'
import BrandTheme from './Brand.Theme'

namespace Brand {
    export interface Description extends BrandDescription {}
    export interface Charts extends BrandCharts {}
    export interface Components extends BrandComponents {}
    export interface Foundation extends BrandFoundation {}
    export interface Layout extends BrandLayout {}
    export interface Palette extends BrandPalette {}
    export interface Semantic extends BrandSemantic {}
    export interface Theme extends BrandTheme {}
}

export default Brand
export { BrandDescription }
