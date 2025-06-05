import * as HelmetModuleType from '../../node_modules/@types/react-helmet'
// @ts-expect-error
import * as HelmetModule from '../../node_modules/react-helmet'

export const Helmet = (HelmetModule as typeof HelmetModuleType).Helmet
export const canUseDOM = (HelmetModule as typeof HelmetModuleType).canUseDOM
export default Helmet as typeof HelmetModuleType.Helmet
