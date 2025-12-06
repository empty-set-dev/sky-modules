import { describe, it, expect, vi } from 'vitest'
import PromisePool from '../PromisePool'

describe('PromisePool', () => {
    describe('constructor', () => {
        it('should create pool with default max count', () => {
            const pool = new PromisePool()
            expect(pool).toBeInstanceOf(PromisePool)
        })

        it('should create pool with custom max count', () => {
            const pool = new PromisePool(5)
            expect(pool).toBeInstanceOf(PromisePool)
        })
    })

    describe('run', () => {
        it('should execute single task', async () => {
            const pool = new PromisePool(2)
            const task = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10))
            })

            await pool.run(task)

            expect(task).toHaveBeenCalledTimes(1)
        })

        it('should execute multiple tasks', async () => {
            const pool = new PromisePool(2)
            const task1 = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10))
            })
            const task2 = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10))
            })

            await Promise.all([
                pool.run(task1),
                pool.run(task2)
            ])

            expect(task1).toHaveBeenCalledTimes(1)
            expect(task2).toHaveBeenCalledTimes(1)
        })

        it('should respect max concurrency limit', async () => {
            const pool = new PromisePool(2)
            let concurrent = 0
            let maxConcurrent = 0

            const task = async () => {
                concurrent++
                maxConcurrent = Math.max(maxConcurrent, concurrent)
                await new Promise(resolve => setTimeout(resolve, 50))
                concurrent--
            }

            await Promise.all([
                pool.run(task),
                pool.run(task),
                pool.run(task),
                pool.run(task),
                pool.run(task)
            ])

            expect(maxConcurrent).toBeLessThanOrEqual(2)
        })

        it('should pass arguments to task', async () => {
            const pool = new PromisePool(2)
            const task = vi.fn(async (a: number, b: string) => {
                return `${a}-${b}`
            })

            await pool.run(task, 42, 'test')

            expect(task).toHaveBeenCalledWith(42, 'test')
        })

        it('should handle task errors', async () => {
            const pool = new PromisePool(2)
            const error = new Error('Task failed')
            const task = vi.fn(async () => {
                throw error
            })

            await expect(pool.run(task)).rejects.toThrow('Task failed')
        })

        it('should queue tasks when pool is full', async () => {
            const pool = new PromisePool(1)
            const executionOrder: number[] = []

            const task = async (id: number) => {
                executionOrder.push(id)
                await new Promise(resolve => setTimeout(resolve, 20))
            }

            await Promise.all([
                pool.run(task, 1),
                pool.run(task, 2),
                pool.run(task, 3)
            ])

            expect(executionOrder).toEqual([1, 2, 3])
        })
    })

    describe('wait', () => {
        it('should wait for all tasks to complete', async () => {
            const pool = new PromisePool(2)
            let completed = 0

            const task = async () => {
                await new Promise(resolve => setTimeout(resolve, 20))
                completed++
            }

            pool.run(task)
            pool.run(task)
            pool.run(task)

            await pool.wait()

            expect(completed).toBe(3)
        })

        it('should resolve immediately when no tasks', async () => {
            const pool = new PromisePool(2)
            const startTime = Date.now()

            await pool.wait()

            const elapsed = Date.now() - startTime
            expect(elapsed).toBeLessThan(10)
        })

        it('should handle mixed fast and slow tasks', async () => {
            const pool = new PromisePool(3)
            const results: string[] = []

            const fastTask = async (id: string) => {
                await new Promise(resolve => setTimeout(resolve, 10))
                results.push(id)
            }

            const slowTask = async (id: string) => {
                await new Promise(resolve => setTimeout(resolve, 50))
                results.push(id)
            }

            pool.run(slowTask, 'slow1')
            pool.run(fastTask, 'fast1')
            pool.run(fastTask, 'fast2')
            pool.run(slowTask, 'slow2')

            await pool.wait()

            expect(results).toHaveLength(4)
            expect(results).toContain('slow1')
            expect(results).toContain('fast1')
            expect(results).toContain('fast2')
            expect(results).toContain('slow2')
        })
    })

    describe('edge cases', () => {
        it('should handle max concurrency of 1', async () => {
            const pool = new PromisePool(1)
            let concurrent = 0

            const task = async () => {
                expect(concurrent).toBe(0)
                concurrent++
                await new Promise(resolve => setTimeout(resolve, 20))
                concurrent--
            }

            await Promise.all([
                pool.run(task),
                pool.run(task),
                pool.run(task)
            ])
        })

        it('should handle high concurrency', async () => {
            const pool = new PromisePool(100)
            let completed = 0

            const task = async () => {
                await new Promise(resolve => setTimeout(resolve, 10))
                completed++
            }

            const promises = Array.from({ length: 50 }, () => pool.run(task))
            await Promise.all(promises)
            await pool.wait()

            expect(completed).toBe(50)
        })

        it('should handle empty tasks', async () => {
            const pool = new PromisePool(2)
            const task = vi.fn(async () => {
                // Empty task
            })

            await pool.run(task)

            expect(task).toHaveBeenCalledTimes(1)
        })
    })
})
