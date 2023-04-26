export default Mayak

interface Mayak {
    GetCategoriesOpts: {
        groupId: null | number
        fbs: boolean
    }
    getCategories(options: Mayak['GetCategoriesOpts']): Promise<unknown>
}

import './`mayak-categories/`mayak-categories'
