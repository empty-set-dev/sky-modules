import '#/client/imports'

import data from 'sky/platform/web/data'

import { onInitStarWars } from './Page.telefunc'

import type { MovieDetails, Movie } from '../types'

export interface StarWarsPageData {
    movies: Movie[]
}

export default data(async pageContext => {
    await pageContext.init({
        ns: [],
    })

    await idle(Time(700, milliseconds)) // Simulate slow network

    const moviesData = await onInitStarWars()

    // We remove data we don't need because the data is passed to the client; we should
    // minimize what is sent over the network.
    const movies = minimize(moviesData)

    return {
        title: `${movies.length} Star Wars Movies`,
        description: '',

        data: {
            movies,
        },
    }
})

function minimize(movies: MovieDetails[]): Movie[] {
    return movies.map(movie => {
        const { title, release_date, id } = movie
        return { title, release_date, id }
    })
}
