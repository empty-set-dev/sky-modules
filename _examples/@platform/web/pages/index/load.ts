'use server'

import 'sky/standard/global'

export default async function load(): Promise<string> {
    await idle(Time(1000, milliseconds))

    console.log(await fetch.json('https://brillout.github.io/star-wars/api/films.json'))

    return 'Test'
}
