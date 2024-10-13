export default Page

import type { Data } from './+data'

import { PageLayout } from '#/layouts/PageLayout'
import { useData } from '#/renderer/useData'

function Page(): ReactNode {
    const { movies } = useData<Data>()

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
