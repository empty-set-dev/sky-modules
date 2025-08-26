import { MovieDetails } from '../types'

export async function onInitStarWars(): Promise<MovieDetails[]> {
    return await fetch.json<MovieDetails[]>('https://brillout.github.io/star-wars/api/films.json')
}
