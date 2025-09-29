import { describe, it, expect, vi } from 'vitest'
import format from './format'
import run from './utilities/run'

vi.mock('./utilities/run')
vi.mock('./utilities/skyPath', () => ({
    default: '/mock/path'
}))

const mockRun = vi.mocked(run)

describe('format', () => {
    it('should run eslint with correct arguments', async () => {
        mockRun.mockResolvedValue(undefined)

        await format()

        expect(mockRun).toHaveBeenCalledWith(
            `cross-env NODE_OPTIONS="--max-old-space-size=8192" /mock/path/node_modules/.bin/eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}'`
        )
    })

    it('should run stylelint with correct arguments', async () => {
        mockRun.mockResolvedValue(undefined)

        await format()

        expect(mockRun).toHaveBeenCalledWith(
            `/mock/path/node_modules/.bin/stylelint --fix '**/*.{css,scss}'`
        )
    })

    it('should handle eslint failures gracefully', async () => {
        mockRun.mockRejectedValueOnce(new Error('eslint failed'))
        mockRun.mockResolvedValue(undefined)

        await expect(format()).resolves.not.toThrow()
    })

    it('should handle stylelint failures gracefully', async () => {
        mockRun.mockResolvedValueOnce(undefined)
        mockRun.mockRejectedValueOnce(new Error('stylelint failed'))

        await expect(format()).resolves.not.toThrow()
    })
})