import data from 'sky/@platform/web/data'

import { onGetTodos } from './Page.telefunc'

const HomePageData = data(async pageContext => {
    const { client } = await pageContext.init({
        ns: [],
    })

    console.log('PREFETCH')
    await client.prefetchQuery({
        queryKey: ['todos'],
        queryFn: async () => await onGetTodos(),
    })

    return {
        title: 'React Query',
        description: '',
    }
})

export default HomePageData
