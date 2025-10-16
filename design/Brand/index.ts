import Brand, { BrandDescription } from './Brand'
import BrandCharts from './Brand.Charts'
import BrandComponents from './Brand.Components'
import BrandFoundation from './Brand.Foundation'
import BrandGlobal from './Brand.Global'
import BrandLayout from './Brand.Layout'
import BrandSemantic from './Brand.Semantic'
import BrandTheme from './Brand.Theme'

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
