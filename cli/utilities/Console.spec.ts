import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import Console, {
    reset,
    bright,
    dim,
    green,
    red,
    yellow,
    blue,
    gray,
} from './Console'

describe('Console utilities', () => {
    describe('ANSI color codes', () => {
        test('exports reset code', () => {
            expect(reset).toBe('\x1b[0m')
        })

        test('exports bright code', () => {
            expect(bright).toBe('\x1b[1m')
        })

        test('exports dim code', () => {
            expect(dim).toBe('\x1b[2m')
        })

        test('exports color codes', () => {
            expect(green).toBe('\x1b[32m')
            expect(red).toBe('\x1b[31m')
            expect(yellow).toBe('\x1b[33m')
            expect(blue).toBe('\x1b[34m')
            expect(gray).toBe('\x1b[90m')
        })
    })

    describe('Console object', () => {
        let writeSpy: ReturnType<typeof vi.spyOn>

        beforeEach(() => {
            writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
        })

        afterEach(() => {
            writeSpy.mockRestore()
        })

        test('extends native console', () => {
            expect(Console.log).toBeDefined()
            expect(Console.error).toBeDefined()
            expect(Console.warn).toBeDefined()
            expect(Console.info).toBeDefined()
        })

        test('success() calls Console.log', () => {
            // Spy on Console.log specifically
            const logSpy = vi.spyOn(Console, 'log').mockImplementation(() => {})

            Console.success('Operation completed')

            expect(logSpy).toHaveBeenCalledWith(
                `${bright}${green}Operation completed${reset}`
            )

            logSpy.mockRestore()
        })

        test('success() formats message with ANSI codes', () => {
            const logSpy = vi.spyOn(Console, 'log').mockImplementation(() => {})

            Console.success('Test')

            const calls = logSpy.mock.calls
            expect(calls.length).toBe(1)
            expect(calls[0][0]).toContain('\x1b[1m') // bright
            expect(calls[0][0]).toContain('\x1b[32m') // green
            expect(calls[0][0]).toContain('Test')
            expect(calls[0][0]).toContain('\x1b[0m') // reset

            logSpy.mockRestore()
        })

        test('write() writes to stdout', () => {
            const result = Console.write('Hello')

            expect(writeSpy).toHaveBeenCalledWith('Hello')
            expect(result).toBe(true)
        })

        test('write() returns stdout write result', () => {
            writeSpy.mockReturnValue(false)

            const result = Console.write('Test')

            expect(result).toBe(false)
        })

        test('write() does not add newline', () => {
            Console.write('No newline')

            expect(writeSpy).toHaveBeenCalledWith('No newline')
            expect(writeSpy.mock.calls[0][0]).not.toContain('\n')
        })

        test('success() with empty string', () => {
            const logSpy = vi.spyOn(Console, 'log').mockImplementation(() => {})

            Console.success('')

            expect(logSpy).toHaveBeenCalledWith(`${bright}${green}${reset}`)

            logSpy.mockRestore()
        })

        test('success() with special characters', () => {
            const logSpy = vi.spyOn(Console, 'log').mockImplementation(() => {})

            Console.success('Test\nNew Line\tTab')

            expect(logSpy).toHaveBeenCalledWith(
                `${bright}${green}Test\nNew Line\tTab${reset}`
            )

            logSpy.mockRestore()
        })

        test('multiple success() calls', () => {
            const logSpy = vi.spyOn(Console, 'log').mockImplementation(() => {})

            Console.success('First')
            Console.success('Second')
            Console.success('Third')

            expect(logSpy).toHaveBeenCalledTimes(3)

            logSpy.mockRestore()
        })

        test('write() with multiple calls', () => {
            Console.write('Part 1')
            Console.write('Part 2')
            Console.write('Part 3')

            expect(writeSpy).toHaveBeenCalledTimes(3)
            expect(writeSpy).toHaveBeenNthCalledWith(1, 'Part 1')
            expect(writeSpy).toHaveBeenNthCalledWith(2, 'Part 2')
            expect(writeSpy).toHaveBeenNthCalledWith(3, 'Part 3')
        })

        test('Console has all native console methods', () => {
            // Test that Console extends console properly
            expect(typeof Console.log).toBe('function')
            expect(typeof Console.error).toBe('function')
            expect(typeof Console.warn).toBe('function')
            expect(typeof Console.info).toBe('function')
            expect(typeof Console.debug).toBe('function')
            expect(typeof Console.trace).toBe('function')
        })
    })
})
