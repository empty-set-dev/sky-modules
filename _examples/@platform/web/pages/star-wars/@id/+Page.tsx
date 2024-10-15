export { Page }

import type { Data } from './+data'

import { PageLayout } from '#/layouts/PageLayout'
import useData from '#/renderer/useData'

function Page(): ReactNode {
    const { movie } = useData<Data>()
    return (
        <PageLayout>
            <h1>{movie.title}</h1>
            Release Date: {movie.release_date}
            <br />
            Director: {movie.director}
            <br />
            Producer: {movie.producer}
        </PageLayout>
    )
}
