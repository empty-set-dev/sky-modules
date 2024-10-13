// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

// The node-fetch package (which only works on the server-side) can be used since
// this file always runs on the server-side, see https://vike.dev/data#server-side
import fetch from 'node-fetch'

import type { MovieDetails } from '../types'
import type { PageContext, PageContextServer } from 'vike/types'

import initPage from '#/renderer/initPage'

const data = async (
    pageContext: PageContextServer
): Promise<
    | null
    | ({
          movie: MovieDetails
      } & PageContext['data'])
> => {
    if (pageContext.isClientSideNavigation) {
        return null
    }

    const data = await initPage(pageContext, {
        ns: [],
    })

    await idle(Time(300, milliseconds)) // Simulate slow network

    const response = await fetch(
        `https://brillout.github.io/star-wars/api/films/${pageContext.routeParams!.id}.json`
    )
    let movie = (await response.json()) as MovieDetails

    // We remove data we don't need because the data is passed to the client; we should
    // minimize what is sent over the network.
    movie = minimize(movie)

    pageContext.title = movie.title
    pageContext.description = ''

    return {
        ...data,
        movie,
        // The page's <title>
    }
}

function minimize(movie: MovieDetails & Record<string, unknown>): MovieDetails {
    const { id, title, release_date, director, producer } = movie
    movie = { id, title, release_date, director, producer }
    return movie
}
