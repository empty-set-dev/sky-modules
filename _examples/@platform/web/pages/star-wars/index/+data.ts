// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import fetch from 'node-fetch'
import { PageContext } from 'vike/types'

import type { MovieDetails, Movie } from '../types'

import initPage from '#/renderer/initPage'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = async (
    pageContext: PageContext
): Promise<
    | null
    | ({
          movies: Movie[]
      } & PageContext['data'])
> => {
    if (pageContext.isClientSideNavigation) {
        return null
    }

    const data = await initPage(pageContext, {
        ns: [],
    })

    await idle(Time(700, milliseconds)) // Simulate slow network

    const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
    const moviesData = (await response.json()) as MovieDetails[]

    // We remove data we don't need because the data is passed to the client; we should
    // minimize what is sent over the network.
    const movies = minimize(moviesData)

    // The page's <title>
    pageContext.title = `${movies.length} Star Wars Movies`
    pageContext.description = ''

    return {
        ...data,
        movies,
    }
}

function minimize(movies: MovieDetails[]): Movie[] {
    return movies.map(movie => {
        const { title, release_date, id } = movie
        return { title, release_date, id }
    })
}
