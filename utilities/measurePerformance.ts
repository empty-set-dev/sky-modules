import Console from './Console'

export default function measurePerformance(
    name: string,
    times: number,
    callback: () => void
): void {
    Console.time(name)

    for (let i = 0; i < times; ++i) {
        callback()
    }

    Console.timeEnd(name)
}
