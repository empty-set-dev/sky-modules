/**
 * Tests for getUnixPath utility
 */

import { describe, test, expect } from 'vitest'
import getUnixPath from '../getUnixPath'

describe('getUnixPath', () => {
    describe('Windows paths', () => {
        test('converts backslashes to forward slashes', () => {
            expect(getUnixPath('C:\\Users\\test\\file.txt')).toBe('C:/Users/test/file.txt')
        })

        test('handles UNC-like paths with drive letters', () => {
            // C:// pattern is converted to file:/// and all backslashes become forward slashes
            expect(getUnixPath('C://Users\\test')).toBe('file:///C:/Users/test')
        })

        test('handles network UNC paths', () => {
            // Double backslashes are converted to forward slashes
            expect(getUnixPath('\\\\server\\share\\file.txt')).toBe('//server/share/file.txt')
        })

        test('handles mixed slashes', () => {
            expect(getUnixPath('C:\\Users/test\\file.txt')).toBe('C:/Users/test/file.txt')
        })

        test('handles multiple consecutive backslashes', () => {
            // C:\\ pattern triggers file:/// conversion
            expect(getUnixPath('C:\\\\Users\\\\test')).toBe('file:///C:/Users//test')
        })
    })

    describe('Unix paths', () => {
        test('leaves Unix paths unchanged', () => {
            const unixPath = '/home/user/file.txt'
            expect(getUnixPath(unixPath)).toBe(unixPath)
        })

        test('handles relative Unix paths', () => {
            const relativePath = 'relative/path/file.txt'
            expect(getUnixPath(relativePath)).toBe(relativePath)
        })

        test('handles paths with dots', () => {
            expect(getUnixPath('../parent/file.txt')).toBe('../parent/file.txt')
            expect(getUnixPath('./current/file.txt')).toBe('./current/file.txt')
        })
    })

    describe('edge cases', () => {
        test('handles empty string', () => {
            expect(getUnixPath('')).toBe('')
        })

        test('handles single slash', () => {
            expect(getUnixPath('/')).toBe('/')
        })

        test('handles single backslash', () => {
            expect(getUnixPath('\\')).toBe('/')
        })

        test('handles root Windows path', () => {
            expect(getUnixPath('C:\\')).toBe('C:/')
        })

        test('handles path with spaces', () => {
            expect(getUnixPath('C:\\Program Files\\test')).toBe('C:/Program Files/test')
        })

        test('handles path with special characters', () => {
            expect(getUnixPath('C:\\Users\\test@123\\file.txt')).toBe('C:/Users/test@123/file.txt')
        })

        test('handles deeply nested paths', () => {
            const deepPath = 'C:\\a\\b\\c\\d\\e\\f\\g\\h\\i\\j\\file.txt'
            const expected = 'C:/a/b/c/d/e/f/g/h/i/j/file.txt'
            expect(getUnixPath(deepPath)).toBe(expected)
        })

        test('preserves file extension', () => {
            expect(getUnixPath('C:\\test\\file.test.ts')).toBe('C:/test/file.test.ts')
        })
    })

    describe('URL-like paths', () => {
        test('handles file:// URLs with Windows paths', () => {
            // D:// is converted to file:///D:/ and backslashes to forward slashes
            expect(getUnixPath('D://workspace\\project')).toBe('file:///D:/workspace/project')
        })

        test('handles different drive letters', () => {
            // Drive letter followed by :// is converted to file:///<letter>:/
            expect(getUnixPath('D://Users')).toBe('file:///D:/Users')
            expect(getUnixPath('E://Data')).toBe('file:///E:/Data')
        })
    })
})
