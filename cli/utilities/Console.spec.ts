import { describe, it, expect, vi } from 'vitest'
import Console from './Console'

// Mock console methods
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('Console', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('log', () => {
        it('should call console.log with arguments', () => {
            Console.log('test message', 123)
            expect(mockConsoleLog).toHaveBeenCalledWith('test message', 123)
        })
    })

    describe('warn', () => {
        it('should call console.warn with arguments', () => {
            Console.warn('warning message', { key: 'value' })
            expect(mockConsoleWarn).toHaveBeenCalledWith('warning message', { key: 'value' })
        })
    })

    describe('error', () => {
        it('should call console.error with arguments', () => {
            Console.error('error message', new Error('test'))
            expect(mockConsoleError).toHaveBeenCalledWith('error message', new Error('test'))
        })
    })
})