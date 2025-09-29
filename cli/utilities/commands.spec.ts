import { describe, it, expect } from 'vitest'
import { nodeCommands, tauriCommands, mobileCommands, webCommands } from './commands'

describe('commands', () => {
    describe('nodeCommands', () => {
        it('should contain node specific commands', () => {
            expect(nodeCommands).toEqual(['dev', 'start'])
            expect(nodeCommands).toContain('dev')
            expect(nodeCommands).toContain('start')
        })
    })

    describe('tauriCommands', () => {
        it('should contain tauri specific commands', () => {
            expect(tauriCommands).toEqual(['init', 'dev', 'build'])
            expect(tauriCommands).toContain('init')
            expect(tauriCommands).toContain('dev')
            expect(tauriCommands).toContain('build')
        })
    })

    describe('mobileCommands', () => {
        it('should contain mobile specific commands', () => {
            const expectedCommands = [
                'mobile init',
                'ios dev',
                'android dev',
                'ios build',
                'android build',
                'ios start',
                'android start',
            ]
            expect(mobileCommands).toEqual(expectedCommands)
        })

        it('should contain ios commands', () => {
            expect(mobileCommands).toContain('ios dev')
            expect(mobileCommands).toContain('ios build')
            expect(mobileCommands).toContain('ios start')
        })

        it('should contain android commands', () => {
            expect(mobileCommands).toContain('android dev')
            expect(mobileCommands).toContain('android build')
            expect(mobileCommands).toContain('android start')
        })
    })

    describe('webCommands', () => {
        it('should contain web specific commands', () => {
            expect(webCommands).toEqual(['dev', 'build', 'preview', 'start'])
            expect(webCommands).toContain('dev')
            expect(webCommands).toContain('build')
            expect(webCommands).toContain('preview')
            expect(webCommands).toContain('start')
        })
    })
})