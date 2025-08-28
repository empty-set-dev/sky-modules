// import readline from 'readline'

import { ArgumentsCamelCase } from 'yargs'

// const askQuestion = (question: string, rl: readline.Interface): Promise<string> => {
//     return new Promise(resolve => {
//         rl.question(question, answer => {
//             resolve(answer)
//         })
//     })
// }

function test() {
    return {
        async [Symbol.dispose](): Promise<void> {
            throw new Error('dispose error')
        },
    } as Disposable
}

async function unhandledRejection(): Promise<void> {
    const a = test()
    a
}

await unhandledRejection()

queueMicrotask(() => {
    // console.log('fine')
})

queueMicrotask(() => {
    // console.log('fail')
})
export default async function add(argv: ArgumentsCamelCase): Promise<void> {
    argv
    // {
    //     const rl = {
    //         [Symbol.dispose]() {
    //             console.log('disposed')
    //         },
    //     }
    // }
    // const some = fs.readFileSync('123')
    // console.log()
    // function onReturn() {
    //     rl.close()
    // }
    // const name = await askQuestion('What is your name? ', rl)
}
