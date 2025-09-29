import { describe, it, expect } from 'vitest'
import getScriptPath from './getScriptPath'

describe('getScriptPath', () => {
    it('should convert import.meta.url to file path', () => {
        const importMetaUrl = 'file:///Users/test/project/src/file.js'
        const result = getScriptPath(importMetaUrl)

        expect(result).toMatch(/Users\/test\/project\/src\/$/)
    })

    it('should handle file URLs correctly', () => {
        const importMetaUrl = 'file:///home/user/app/script.js'
        const result = getScriptPath(importMetaUrl)

        expect(result).toMatch(/home\/user\/app\/$/)
    })

    it('should return directory path ending with slash', () => {
        const importMetaUrl = 'file:///path/to/file.js'
        const result = getScriptPath(importMetaUrl)

        expect(result).toMatch(/\/$/)
    })
})