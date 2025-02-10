export default Page

import PageLayout from '#/layouts/PageLayout'
import useData from '../../../../../pkgs/@artsy/fresnel/renderer/useData'

import StarWarsData from './+data'

function Page(): ReactNode {
    const { isLoading, movies } = useData(StarWarsData)

    if (isLoading) {
        return <PageLayout>Loading...</PageLayout>
    }

    if (!movies) {
        return <PageLayout>Error while loading movies</PageLayout>
    }

    return (
        <PageLayout>
            <h1>Star Wars Movies</h1>
            <ol>
                {movies.map(({ id, title, release_date }) => (
                    <li key={id}>
                        <a href={`/star-wars/${id}`}>{title}</a> ({release_date})
                    </li>
                ))}
            </ol>
            <p>
                Source:{' '}
                <a href="https://brillout.github.io/star-wars/">brillout.github.io/star-wars</a>.
            </p>
            <p>
                Data can be fetched by using the <code>data()</code> hook.
            </p>
        </PageLayout>
    )
}
