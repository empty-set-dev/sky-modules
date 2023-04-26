/* eslint-disable no-console */
import axios from 'axios'

import { API_HOST, from_date, to_date, period, Cookie } from '../`mayak-parameters'

export interface GetMayakCategoriesParams {
    groupId: null | number
    fbs: boolean
}
export default getMayakCategories
type getMayakCategories = typeof getMayakCategories
async function getMayakCategories(params: GetMayakCategoriesParams): Promise<unknown> {
    const { groupId, fbs } = params

    const { data } = await axios.get(`${API_HOST}/wb/categories/details`, {
        params: {
            wb_group_id: groupId,
            fbs: fbs.toString(),
            from_date,
            to_date,
            period,
            favourite: '',
        },
        headers: { Cookie },
    })

    if (!data.categories) {
        throw Error('Auth')
    }

    return data.categories
}
