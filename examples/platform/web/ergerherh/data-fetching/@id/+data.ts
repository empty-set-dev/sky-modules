import '#/imports'
import data from 'sky/platform/web/helpers/data'

import { MovieDetails } from '../types'

import { onFetchStarWarsMovie } from './Page.telefunc'

const StarWarsMovieData = data(async pageContext => {
    await pageContext.init({
        ns: [],
    })

    const movieData = await onFetchStarWarsMovie(pageContext.routeParams.id)

    // We remove data we don't need because the data is passed to the client; we should
    // minimize what is sent over the network.
    const movie = minimize(movieData)

    return {
        title: movie.title,
        description: '',

        data: {
            movie,
        },
    }
})

export default StarWarsMovieData

function minimize(movie: MovieDetails & Record<string, unknown>): MovieDetails {
    const { id, title, release_date, director, producer } = movie
    movie = { id, title, release_date, director, producer }
    return movie
}
