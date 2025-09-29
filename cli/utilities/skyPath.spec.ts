import { describe, it, expect, vi, beforeEach } from 'vitest'
import path from 'path'

vi.mock('./getScriptPath')

describe('skyPath', () => {
    beforeEach(() => {
        vi.resetModules()
    })

    it('should return relative path to sky modules root', async () => {
        const mockGetScriptPath = await import('./getScriptPath')
        vi.mocked(mockGetScriptPath.default).mockReturnValue('/Users/test/sky-modules/cli/utilities/')

        const originalCwd = process.cwd()
        vi.spyOn(process, 'cwd').mockReturnValue('/Users/test/project')

        const skyPath = await import('./skyPath')

        expect(skyPath.default).toBe(path.relative('/Users/test/project', '/Users/test/sky-modules'))

        vi.mocked(process.cwd).mockReturnValue(originalCwd)
    })

    it('should return "." when path is empty', async () => {
        const mockGetScriptPath = await import('./getScriptPath')
        vi.mocked(mockGetScriptPath.default).mockReturnValue('/Users/test/project/cli/utilities/')

        vi.spyOn(process, 'cwd').mockReturnValue('/Users/test/project')

        const skyPath = await import('./skyPath')

        expect(skyPath.default).toBe('.')
    })
})