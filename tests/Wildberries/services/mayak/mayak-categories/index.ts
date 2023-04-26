import * as local from './defaultly'

globalify({
    getMayakCategories: local.getMayakCategories,
})

declare global {
    type getMayakCategories = local.getMayakCategories
    function getMayakCategories(options: local.GetMayakCategoriesOpts): Promise<unknown>
}
