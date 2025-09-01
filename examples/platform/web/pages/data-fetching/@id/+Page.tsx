import '#/imports'

import useData from 'sky/platform/web/renderer/useData'

import PageLayout from '#/layouts/PageLayout'

import StarWarsMovieData from './+data'

export default function Page(): ReactNode {
    const { isLoading, movie } = useData(StarWarsMovieData)

    if (isLoading) {
        return <PageLayout>Loading...</PageLayout>
    }

    if (!movie) {
        return <PageLayout>Error while loading movies</PageLayout>
    }

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
