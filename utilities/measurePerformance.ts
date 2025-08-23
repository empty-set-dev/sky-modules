import Console from './Console'

export default function measurePerformance(
    name: string,
    times: number,
    callback: (iteration: number) => void
): void {
    Console.time(name)

    for (let i = 0; i < times; ++i) {
        callback(i + 1)
    }

    Console.timeEnd(name)
}
