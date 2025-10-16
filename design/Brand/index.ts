import Brand, { BrandDescription } from './Brand'
import BrandCharts from './Brand.Charts'
import BrandComponents from './Brand.Components'
import BrandFoundation from './Brand.Foundation'
import BrandLayout from './Brand.Layout'
import BrandPalette from './Brand.Theme'
import BrandSemantic from './Brand.Semantic'
import BrandTheme, {InvertColorScale} from './Brand.Theme'

namespace Brand {
    export interface Description extends BrandDescription {}
    export interface Charts extends BrandCharts {}
    export interface Components extends BrandComponents {}
    export interface Foundation extends BrandFoundation {}
    export interface Global extends BrandGlobal {}
    export interface Layout extends BrandLayout {}
    export interface Semantic extends BrandSemantic {}
    export interface Theme extends BrandTheme {}
}

export default Brand
