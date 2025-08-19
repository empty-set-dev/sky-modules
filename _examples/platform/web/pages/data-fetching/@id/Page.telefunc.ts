import { MovieDetails } from '../types'

export async function onFetchStarWarsMovie(id: string): Promise<MovieDetails> {
    return await fetch.json<MovieDetails>(
        `https://brillout.github.io/star-wars/api/films/${id}.json`
    )
}
