import { describe, it, expect } from 'vitest'
import getUnixPath from './getUnixPath'

describe('getUnixPath', () => {
    it('should convert Windows path to Unix format', () => {
        const windowsPath = 'C:\\Users\\test\\folder'
        const result = getUnixPath(windowsPath)

        expect(result).toBe('C:/Users/test/folder')
    })

    it('should convert Windows UNC path to file URL', () => {
        const uncPath = 'C://server/share'
        const result = getUnixPath(uncPath)

        expect(result).toBe('file:///C:\\/server/share')
    })

    it('should handle already Unix paths', () => {
        const unixPath = '/home/user/folder'
        const result = getUnixPath(unixPath)

        expect(result).toBe('/home/user/folder')
    })

    it('should handle mixed separators', () => {
        const mixedPath = 'C:\\Users/test\\folder/file.txt'
        const result = getUnixPath(mixedPath)

        expect(result).toBe('C:/Users/test/folder/file.txt')
    })

    it('should handle empty string', () => {
        const result = getUnixPath('')

        expect(result).toBe('')
    })

    it('should handle single character drive', () => {
        const path = 'D:\\test'
        const result = getUnixPath(path)

        expect(result).toBe('D:/test')
    })
})