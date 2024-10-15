'use server'

import 'sky/standard/global'

import fetch from 'node-fetch'

export default async function load(): Promise<unknown> {
    'use server'

    await idle(Time(1000, milliseconds))

    const result = await (await fetch('https://brillout.github.io/star-wars/api/films.json')).json()
    console.log(result)

    return result
}
