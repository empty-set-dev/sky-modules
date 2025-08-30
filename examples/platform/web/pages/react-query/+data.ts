import '#/imports'
import data from 'sky/platform/web/helpers/data'
import runsOnServerSide from 'sky/platform/web/utilities/runsOnServerSide'

export default data(async pageContext => {
    const { queryClient } = await pageContext.init({ ns: [] })

    if (runsOnServerSide) {
        queryClient.setQueryData(
            ['repoData'],
            await fetch.json('https://api.github.com/repos/tannerlinsley/react-query')
        )
    }

    return {
        title: 'React Query',
        description: '',
    }
})
