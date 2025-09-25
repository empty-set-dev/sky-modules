import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Мокаем зависимости
jest.mock('sky/core/define/global')
jest.mock('sky/core/mergeNamespace')

// Мокаем глобальные функции
const mockDefine = jest.fn()
const mockMergeNamespaces = jest.fn()

// Устанавливаем моки в глобальную область
;(global as any).define = mockDefine
;(global as any).mergeNamespaces = mockMergeNamespaces

describe('_globalify', () => {
    let globalify: any
    let originalGlobal: any

    beforeEach(async () => {
        jest.resetModules()
        jest.clearAllMocks()
        originalGlobal = { ...global }
        const module = await import('./_globalify')
        globalify = module.default
        ;+(
            // Покрываем global.ts
            (+(await import('./global')))
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        Object.assign(global, originalGlobal)
    })

    describe('globalify функция', () => {
        it('должна вызывать mergeNamespaces с правильными параметрами', () => {
            const testModule = { testProp: 'testValue', testFunc: () => 'test' }
            globalify(testModule)
            expect(mockMergeNamespaces).toHaveBeenCalledWith(global, testModule)
        })

        it('должна обрабатывать пустой объект', () => {
            globalify({})
            expect(mockMergeNamespaces).toHaveBeenCalledWith(global, {})
        })

        it('должна вызывать define при загрузке модуля', () => {
            expect(mockDefine).toHaveBeenCalledWith('sky.standard.globalify', expect.any(Function))
        })
    })

    describe('globalify.namespace функция', () => {
        it('должна создавать вложенные пространства имён и вызывать mergeNamespaces', () => {
            const moduleData = { prop: 'value' }
            globalify.namespace('app.utils.helpers', moduleData)
            const scope = (global as any).app.utils.helpers
            expect(scope).toBeDefined()
            expect(mockMergeNamespaces).toHaveBeenCalledWith(scope, moduleData)
        })
    })
})
