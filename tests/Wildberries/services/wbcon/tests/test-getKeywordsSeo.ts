/* eslint-disable no-console */
import getKeywordsSeo from '../getKeywordsSeo'

get('ботинки', 2)
async function get(keywords: string, limit: number, iteration = 1): Promise<void> {
    return getKeywordsSeo({
        keywords,
    })
        .then(
            async ({
                week: {
                    data: { list },
                },
            }) => {
                list = list.filter(item => item.requestCount > 10000)
                for (const item of list) {
                    console.log(
                        iteration,
                        Array(iteration - 1)
                            .fill(' ')
                            .join(''),
                        item
                    )
                    if (iteration < limit) {
                        await get(item.text, limit, iteration + 1)
                    }
                }
            }
        )
        .catch(err => {
            console.error(err)
        })
}
