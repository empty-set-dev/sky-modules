// import AppServer from '#/server/AppServer'
import fs from 'fs'

export async function onTest(x: number): Promise<{ x: number; a: string; b: string; c: string }> {
    Console.log(x, fs.readdirSync('.'))
    const [a, b, c] = await Promise.all([onDataA(), onDataB(), onDataC()])
    return {
        x,
        a,
        b,
        c,
    }
    // Console.log(x, getSingleton(AppServer))
}

export async function onDataA(): Promise<string> {
    await idle((0.3).seconds)
    return 'data A'
}
export async function onDataB(): Promise<string> {
    await idle((0.4).seconds)
    return 'data B'
}
export async function onDataC(): Promise<string> {
    await idle((2).seconds)
    return 'data C'
}
