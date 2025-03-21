import data from 'sky/platform/web/data'
import runsOnServerSide from 'sky/platform/web/runsOnServerSide'

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
