import { describe, it, expect } from 'vitest'
import getCommandMode from './getCommandMode'

describe('getCommandMode', () => {
    it('should return development by default', () => {
        expect(getCommandMode('unknown')).toBe('development')
    })

    it('should return test for test command', () => {
        expect(getCommandMode('test')).toBe('test')
    })

    it('should return production for readme command', () => {
        expect(getCommandMode('readme')).toBe('production')
    })

    describe('web commands', () => {
        it('should return development for web dev', () => {
            expect(getCommandMode('web', 'dev')).toBe('development')
        })

        it('should return production for web build', () => {
            expect(getCommandMode('web', 'build')).toBe('production')
        })

        it('should return production for web preview', () => {
            expect(getCommandMode('web', 'preview')).toBe('production')
        })

        it('should return production for web start', () => {
            expect(getCommandMode('web', 'start')).toBe('production')
        })
    })

    describe('node commands', () => {
        it('should return development for node dev', () => {
            expect(getCommandMode('node', 'dev')).toBe('development')
        })

        it('should return production for node start', () => {
            expect(getCommandMode('node', 'start')).toBe('production')
        })
    })

    describe('desktop commands', () => {
        it('should return development for desktop dev', () => {
            expect(getCommandMode('desktop', 'dev')).toBe('development')
        })

        it('should return production for desktop build', () => {
            expect(getCommandMode('desktop', 'build')).toBe('production')
        })

        it('should return production for desktop start', () => {
            expect(getCommandMode('desktop', 'start')).toBe('production')
        })
    })

    it('should handle commands without subcommands', () => {
        expect(getCommandMode('web')).toBe('development')
        expect(getCommandMode('node')).toBe('development')
        expect(getCommandMode('desktop')).toBe('development')
    })

    it('should handle null subcommand', () => {
        expect(getCommandMode('web', null)).toBe('development')
        expect(getCommandMode('node', null)).toBe('development')
    })
})