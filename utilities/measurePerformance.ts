import Console from '@sky-modules/core/Console'

export default function measurePerformance(
    times: number,
    cyclesCount: number,
    variations: [name: string, callback: (iteration: number) => void][]
): void {
    const results: number[] = []
    repeat(cyclesCount, i => {
        Console.log(`Cycle ${i + 1}`)
        variations.forEach((variation, j) => {
            Console.log(variation[0])

            results[j] ??= 0
            const [, callback] = variation
            const time = Date.now()

            for (let k = 0; k < times; ++k) {
                callback(k + 1)
            }

            const deltaTime = Date.now() - time
            results[j] += deltaTime
            Console.log(`${deltaTime}ms\n`)
        })
    })
    results.forEach((result, i) =>
        Console.log(`${variations[i][0]}: ${Math.floor(result / cyclesCount)}ms`)
    )
}
