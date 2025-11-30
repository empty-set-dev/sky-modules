import { describe, test, expect } from 'vitest'
import {
    filePredicates,
    shouldProcessFile,
    MODULE_EXTENSIONS,
    SPECIAL_FILE_PATTERN,
} from '../filePredicates'

describe('filePredicates', () => {
    describe('isModule', () => {
        test('returns true for .ts files', () => {
            expect(filePredicates.isModule('component.ts')).toBe(true)
        })

        test('returns true for .tsx files', () => {
            expect(filePredicates.isModule('Component.tsx')).toBe(true)
        })

        test('returns true for .js files', () => {
            expect(filePredicates.isModule('utility.js')).toBe(true)
        })

        test('returns true for .jsx files', () => {
            expect(filePredicates.isModule('Component.jsx')).toBe(true)
        })

        test('returns false for non-module files', () => {
            expect(filePredicates.isModule('README.md')).toBe(false)
            expect(filePredicates.isModule('package.json')).toBe(false)
            expect(filePredicates.isModule('config.yml')).toBe(false)
        })
    })

    describe('isTest', () => {
        test('returns true for .test. files', () => {
            expect(filePredicates.isTest('component.test.ts')).toBe(true)
            expect(filePredicates.isTest('helper.test.tsx')).toBe(true)
        })

        test('returns true for .spec. files', () => {
            expect(filePredicates.isTest('component.spec.ts')).toBe(true)
            expect(filePredicates.isTest('helper.spec.tsx')).toBe(true)
        })

        test('returns false for non-test files', () => {
            expect(filePredicates.isTest('component.ts')).toBe(false)
            expect(filePredicates.isTest('helper.tsx')).toBe(false)
        })
    })

    describe('isIndex', () => {
        test('returns true for index files', () => {
            expect(filePredicates.isIndex('index.ts')).toBe(true)
            expect(filePredicates.isIndex('index.tsx')).toBe(true)
            expect(filePredicates.isIndex('index.js')).toBe(true)
        })

        test('returns false for non-index files', () => {
            expect(filePredicates.isIndex('component.ts')).toBe(false)
            expect(filePredicates.isIndex('myindex.ts')).toBe(false)
        })
    })

    describe('isGlobal', () => {
        test('returns true for global. prefix files', () => {
            expect(filePredicates.isGlobal('global.ts')).toBe(true)
            expect(filePredicates.isGlobal('global.d.ts')).toBe(true)
        })

        test('returns true for .global. infix files', () => {
            expect(filePredicates.isGlobal('Array.global.ts')).toBe(true)
            expect(filePredicates.isGlobal('types.global.d.ts')).toBe(true)
        })

        test('returns false for non-global files', () => {
            expect(filePredicates.isGlobal('component.ts')).toBe(false)
            expect(filePredicates.isGlobal('globally.ts')).toBe(false)
        })
    })

    describe('isExtension', () => {
        test('returns true for .extension. files', () => {
            expect(filePredicates.isExtension('Array.extension.ts')).toBe(true)
            expect(filePredicates.isExtension('String.extension.lite.tsx')).toBe(true)
        })

        test('returns false for non-extension files', () => {
            expect(filePredicates.isExtension('component.ts')).toBe(false)
        })
    })

    describe('isNamespace', () => {
        test('returns true for .namespace. files', () => {
            expect(filePredicates.isNamespace('Config.namespace.ts')).toBe(true)
            expect(filePredicates.isNamespace('Types.namespace.tsx')).toBe(true)
        })

        test('returns false for non-namespace files', () => {
            expect(filePredicates.isNamespace('component.ts')).toBe(false)
        })
    })

    describe('isImplementation', () => {
        test('returns true for .implementation. files', () => {
            expect(filePredicates.isImplementation('feature.implementation.ts')).toBe(true)
        })

        test('returns false for non-implementation files', () => {
            expect(filePredicates.isImplementation('component.ts')).toBe(false)
        })
    })

    describe('isInternal', () => {
        test('returns true for Internal in name', () => {
            expect(filePredicates.isInternal('Internal.ts')).toBe(true)
            expect(filePredicates.isInternal('ConfigInternal.ts')).toBe(true)
        })

        test('returns true for internal in name', () => {
            expect(filePredicates.isInternal('internal.ts')).toBe(true)
            expect(filePredicates.isInternal('internalConfig.ts')).toBe(true)
        })

        test('returns false for non-internal files', () => {
            expect(filePredicates.isInternal('component.ts')).toBe(false)
        })
    })

    describe('isExample', () => {
        test('returns true for .example. files', () => {
            expect(filePredicates.isExample('usage.example.ts')).toBe(true)
        })

        test('returns false for non-example files', () => {
            expect(filePredicates.isExample('component.ts')).toBe(false)
        })
    })

    describe('isRecipe', () => {
        test('returns true for .recipe. files', () => {
            expect(filePredicates.isRecipe('button.recipe.ts')).toBe(true)
            expect(filePredicates.isRecipe('card.recipe.lite.tsx')).toBe(true)
        })

        test('returns false for non-recipe files', () => {
            expect(filePredicates.isRecipe('component.ts')).toBe(false)
        })
    })

    describe('isContext', () => {
        test('returns true for .context. files', () => {
            expect(filePredicates.isContext('auth.context.ts')).toBe(true)
        })

        test('returns false for non-context files', () => {
            expect(filePredicates.isContext('component.ts')).toBe(false)
        })
    })

    describe('isLite', () => {
        test('returns true for .lite. files', () => {
            expect(filePredicates.isLite('Button.lite.tsx')).toBe(true)
            expect(filePredicates.isLite('Card.lite.ts')).toBe(true)
        })

        test('returns false for non-lite files', () => {
            expect(filePredicates.isLite('component.tsx')).toBe(false)
        })
    })

    describe('isSpecialFile', () => {
        test('returns true for global files', () => {
            expect(filePredicates.isSpecialFile('Array.global.ts')).toBe(true)
        })

        test('returns true for extension files', () => {
            expect(filePredicates.isSpecialFile('String.extension.ts')).toBe(true)
        })

        test('returns true for namespace files', () => {
            expect(filePredicates.isSpecialFile('Config.namespace.ts')).toBe(true)
        })

        test('returns true for implementation files', () => {
            expect(filePredicates.isSpecialFile('feature.implementation.ts')).toBe(true)
        })

        test('returns true for lite special files', () => {
            expect(filePredicates.isSpecialFile('Button.extension.lite.tsx')).toBe(true)
        })

        test('returns false for regular files', () => {
            expect(filePredicates.isSpecialFile('component.ts')).toBe(false)
            expect(filePredicates.isSpecialFile('helper.tsx')).toBe(false)
        })
    })
})

describe('shouldProcessFile', () => {
    test('returns true for regular module files', () => {
        expect(shouldProcessFile('component.ts')).toBe(true)
        expect(shouldProcessFile('helper.tsx')).toBe(true)
    })

    test('returns false for test files by default', () => {
        expect(shouldProcessFile('component.test.ts')).toBe(false)
        expect(shouldProcessFile('helper.spec.tsx')).toBe(false)
    })

    test('returns true for test files when includeTests is true', () => {
        expect(shouldProcessFile('component.test.ts', { includeTests: true })).toBe(true)
    })

    test('returns false for index files', () => {
        expect(shouldProcessFile('index.ts')).toBe(false)
    })

    test('returns false for global files', () => {
        expect(shouldProcessFile('global.ts')).toBe(false)
        expect(shouldProcessFile('Array.global.ts')).toBe(false)
    })

    test('returns false for internal files by default', () => {
        expect(shouldProcessFile('Internal.ts')).toBe(false)
        expect(shouldProcessFile('internalHelper.ts')).toBe(false)
    })

    test('returns true for internal files when includeInternal is true', () => {
        expect(shouldProcessFile('Internal.ts', { includeInternal: true })).toBe(true)
    })

    test('returns false for example files by default', () => {
        expect(shouldProcessFile('usage.example.ts')).toBe(false)
    })

    test('returns true for example files when includeExamples is true', () => {
        expect(shouldProcessFile('usage.example.ts', { includeExamples: true })).toBe(true)
    })

    test('returns false for recipe files by default', () => {
        expect(shouldProcessFile('button.recipe.ts')).toBe(false)
    })

    test('returns true for recipe files when includeRecipes is true', () => {
        expect(shouldProcessFile('button.recipe.ts', { includeRecipes: true })).toBe(true)
    })

    test('returns false for context files by default', () => {
        expect(shouldProcessFile('auth.context.ts')).toBe(false)
    })

    test('returns true for context files when includeContext is true', () => {
        expect(shouldProcessFile('auth.context.ts', { includeContext: true })).toBe(true)
    })

    test('returns false for non-module files', () => {
        expect(shouldProcessFile('README.md')).toBe(false)
        expect(shouldProcessFile('package.json')).toBe(false)
    })

    test('handles multiple options together', () => {
        expect(
            shouldProcessFile('internal.test.ts', {
                includeTests: true,
                includeInternal: true,
            })
        ).toBe(true)

        expect(
            shouldProcessFile('internal.test.ts', {
                includeTests: false,
                includeInternal: true,
            })
        ).toBe(false)
    })
})

describe('MODULE_EXTENSIONS', () => {
    test('exports array of module extensions', () => {
        expect(MODULE_EXTENSIONS).toEqual(['.ts', '.tsx', '.js', '.jsx'])
    })
})

describe('SPECIAL_FILE_PATTERN', () => {
    test('matches special file patterns', () => {
        expect(SPECIAL_FILE_PATTERN.test('file.global.ts')).toBe(true)
        expect(SPECIAL_FILE_PATTERN.test('file.extension.tsx')).toBe(true)
        expect(SPECIAL_FILE_PATTERN.test('file.namespace.js')).toBe(true)
        expect(SPECIAL_FILE_PATTERN.test('file.implementation.jsx')).toBe(true)
        expect(SPECIAL_FILE_PATTERN.test('file.extension.lite.tsx')).toBe(true)
    })

    test('does not match regular files', () => {
        expect(SPECIAL_FILE_PATTERN.test('component.ts')).toBe(false)
        expect(SPECIAL_FILE_PATTERN.test('helper.tsx')).toBe(false)
    })
})
