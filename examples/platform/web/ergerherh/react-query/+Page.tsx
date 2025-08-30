import '#/imports'
import { useQuery } from 'pkgs/@tanstack/react-query'
import useData from 'sky/platform/web/renderer/useData'

import PageLayout from '#/layouts/PageLayout'

import Data from './+data'

export default function ReactQueryPage(): ReactNode {
    useData(Data)

    const { isLoading, error, data } = useQuery<{
        name: string
        description: string
        subscribers_count: number
        stargazers_count: number
        forks_count: number
    }>({
        queryKey: ['repoData'],
        queryFn: () => fetch.json('https://api.github.com/repos/tannerlinsley/react-query'),
    })

    if (isLoading) {
        return <PageLayout>Loading...</PageLayout>
    }

    if (error) {
        return <PageLayout>{'An error has occurred: ' + error.message}</PageLayout>
    }

    if (!data) {
        return <PageLayout>{'An error has occurred: no data'}</PageLayout>
    }

    return (
        <PageLayout>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <strong>👀 {data.subscribers_count}</strong> <strong>✨ {data.stargazers_count}</strong>{' '}
            <strong>🍴 {data.forks_count}</strong>
        </PageLayout>
    )
}
