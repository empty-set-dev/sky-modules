import axios from 'axios'

import Mayak from '..'

import { API_HOST, from_date, to_date, period, Cookie } from './``mayak-options'

export default Mayak

namespace Mayak {
    export async function getCategories(options: Mayak['GetCategoriesOpts']): Promise<unknown> {
        const { groupId, fbs } = options

        const {
            data: { categories },
        } = await axios.get(`${API_HOST}/wb/categories/details`, {
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

        return categories
    }
}
