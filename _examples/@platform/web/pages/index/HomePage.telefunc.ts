import z from 'zod'

const schema = z.tuple([z.string().min(5)])

export async function onInitHomePage(test: string): Promise<number> {
    schema.parse([test])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await fetch.json<any>('https://brillout.github.io/star-wars/api/films.json')
    // eslint-disable-next-line no-console
    console.log(result[0].title)

    return 42
}
