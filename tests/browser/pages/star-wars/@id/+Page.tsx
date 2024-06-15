export { Page }

import { useData } from 'tests/browser/renderer/useData'

import type { Data } from './+data'

function Page(): ReactNode {
    const { movie } = useData<Data>()
    return (
        <>
            <h1>{movie.title}</h1>
            Release Date: {movie.release_date}
            <br />
            Director: {movie.director}
            <br />
            Producer: {movie.producer}
        </>
    )
}
