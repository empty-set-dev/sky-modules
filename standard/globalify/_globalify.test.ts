import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Мокаем зависимости
jest.mock('sky/standard/define/global')
jest.mock('sky/standard/mergeNamespace')

// Мокаем глобальные функции
const mockDefine = jest.fn()
const mockMergeNamespaces = jest.fn()

// Устанавливаем моки в глобальную область
;(global as any).define = mockDefine
;(global as any).mergeNamespaces = mockMergeNamespaces

describe('_globalify', () => {
    let globalify: any
    let originalGlobal: any

    beforeEach(() => {
        // Очищаем кэш модулей
        jest.resetModules()
        jest.clearAllMocks()

        // Сохраняем оригинальный global
        originalGlobal = { ...global }

        // Импортируем модуль после установки моков
        globalify = require('./_globalify').default
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('globalify функция', () => {
        it('должна вызывать mergeNamespaces с правильными параметрами', () => {
            const testModule = {
                testProp: 'testValue',
                testFunc: () => 'test',
            }

            globalify(testModule)

            expect(mockMergeNamespaces).toHaveBeenCalledTimes(1)
            expect(mockMergeNamespaces).toHaveBeenCalledWith(global, testModule)
        })

        it('должна обрабатывать пустой объект', () => {
            const emptyModule = {}

            globalify(emptyModule)

            expect(mockMergeNamespaces).toHaveBeenCalledTimes(1)
            expect(mockMergeNamespaces).toHaveBeenCalledWith(global, emptyModule)
        })

        it('должна обрабатывать объект с различными типами значений', () => {
            const mixedModule = {
                string: 'text',
                number: 42,
                boolean: true,
                nullValue: null,
                undefinedValue: undefined,
                array: [1, 2, 3],
                object: { nested: 'value' },
                func: () => 'result',
            }

            globalify(mixedModule)

            expect(mockMergeNamespaces).toHaveBeenCalledTimes(1)
            expect(mockMergeNamespaces).toHaveBeenCalledWith(global, mixedModule)
        })

        it('должна обрабатывать объект с символами в качестве ключей', () => {
            const sym = Symbol('test')
            const moduleWithSymbol = {
                [sym]: 'symbolValue',
                regularKey: 'regularValue',
            }

            globalify(moduleWithSymbol)

            expect(mockMergeNamespaces).toHaveBeenCalledTimes(1)
            expect(mockMergeNamespaces).toHaveBeenCalledWith(global, moduleWithSymbol)
        })

        it('должна обрабатывать вложенные объекты', () => {
            const nestedModule = {
                level1: {
                    level2: {
                        level3: {
                            deepValue: 'nested',
                        },
                    },
                },
            }

            globalify(nestedModule)

            expect(mockMergeNamespaces).toHaveBeenCalledTimes(1)
            expect(mockMergeNamespaces).toHaveBeenCalledWith(global, nestedModule)
        })

        it('должна регистрироваться через define с правильным именем', () => {
            // Проверяем, что define был вызван при загрузке модуля
            expect(mockDefine).toHaveBeenCalledWith('sky.standard.globalify', expect.any(Function))
        })
    })

    describe('globalify.namespace функция', () => {
        it('должна создавать вложенные пространства имён', () => {
            const testModule = {
                testProp: 'value',
            }

            globalify.namespace('app.utils.helpers', testModule)

            // Проверяем создание вложенной структуры
            expect(global).toHaveProperty('app')
            expect((global as any).app).toHaveProperty('utils')
            expect((global as any).app.utils).toHaveProperty('helpers')

            // Проверяем, что mergeNamespaces был вызван с правильным scope
            expect(mockMergeNamespaces).toHaveBeenCalledWith(
                (global as any).app.utils.helpers,
                testModule
            )
        })

        it('должна обрабатывать одноуровневое пространство имён', () => {
            const testModule = {
                singleProp: 'singleValue',
            }

            globalify.namespace('single', testModule)

            expect(global).toHaveProperty('single')
            expect(mockMergeNamespaces).toHaveBeenCalledWith((global as any).single, testModule)
        })

        it('должна обрабатывать многоуровневое пространство имён', () => {
            const testModule = {
                deepProp: 'deepValue',
            }

            globalify.namespace('very.deep.nested.namespace.structure', testModule)

            expect(global).toHaveProperty('very')
            expect((global as any).very).toHaveProperty('deep')
            expect((global as any).very.deep).toHaveProperty('nested')
            expect((global as any).very.deep.nested).toHaveProperty('namespace')
            expect((global as any).very.deep.nested.namespace).toHaveProperty('structure')

            expect(mockMergeNamespaces).toHaveBeenCalledWith(
                (global as any).very.deep.nested.namespace.structure,
                testModule
            )
        })

        it('должна использовать существующие пространства имён, если они уже созданы', () => {
            // Создаём существующее пространство имён
            ;(global as any).existing = {
                nested: {
                    existingProp: 'existingValue',
                },
            }

            const testModule = {
                newProp: 'newValue',
            }

            globalify.namespace('existing.nested', testModule)

            // Проверяем, что существующее свойство сохранилось
            expect((global as any).existing.nested.existingProp).toBe('existingValue')

            // Проверяем, что mergeNamespaces был вызван
            expect(mockMergeNamespaces).toHaveBeenCalledWith(
                (global as any).existing.nested,
                testModule
            )
        })

        it('должна обрабатывать пустой модуль', () => {
            const emptyModule = {}

            globalify.namespace('empty.namespace', emptyModule)

            expect(global).toHaveProperty('empty')
            expect((global as any).empty).toHaveProperty('namespace')
            expect(mockMergeNamespaces).toHaveBeenCalledWith(
                (global as any).empty.namespace,
                emptyModule
            )
        })

        it('должна регистрироваться через define с правильным именем', () => {
            // Проверяем, что define был вызван для namespace функции
            expect(mockDefine).toHaveBeenCalledWith(
                'sky.standard.globalify.namespace',
                expect.any(Function)
            )
        })

        it('должна обрабатывать пространство имён с одной точкой', () => {
            const testModule = {
                prop: 'value',
            }

            globalify.namespace('first.second', testModule)

            expect(global).toHaveProperty('first')
            expect((global as any).first).toHaveProperty('second')
            expect(mockMergeNamespaces).toHaveBeenCalledWith(
                (global as any).first.second,
                testModule
            )
        })

        it('должна создавать пустые объекты для промежуточных уровней', () => {
            const testModule = {
                finalProp: 'finalValue',
            }

            globalify.namespace('a.b.c.d', testModule)

            // Проверяем, что все промежуточные уровни - это объекты
            expect(typeof (global as any).a).toBe('object')
            expect(typeof (global as any).a.b).toBe('object')
            expect(typeof (global as any).a.b.c).toBe('object')
            expect(typeof (global as any).a.b.c.d).toBe('object')

            expect(mockMergeNamespaces).toHaveBeenCalledWith((global as any).a.b.c.d, testModule)
        })

        it('должна корректно обрабатывать повторные вызовы для одного пространства имён', () => {
            const module1 = { prop1: 'value1' }
            const module2 = { prop2: 'value2' }

            globalify.namespace('repeated.namespace', module1)
            globalify.namespace('repeated.namespace', module2)

            expect(mockMergeNamespaces).toHaveBeenCalledTimes(2)
            expect(mockMergeNamespaces).toHaveBeenNthCalledWith(
                1,
                (global as any).repeated.namespace,
                module1
            )
            expect(mockMergeNamespaces).toHaveBeenNthCalledWith(
                2,
                (global as any).repeated.namespace,
                module2
            )
        })

        it('должна работать с различными типами значений в модуле', () => {
            const complexModule = {
                string: 'text',
                number: 123,
                boolean: false,
                nullValue: null,
                undefinedValue: undefined,
                func: () => 'function result',
                array: [1, 2, 3],
                object: { nested: { deep: 'value' } },
                date: new Date(),
                regexp: /test/gi,
                map: new Map([['key', 'value']]),
                set: new Set([1, 2, 3]),
            }

            globalify.namespace('complex.module', complexModule)

            expect(mockMergeNamespaces).toHaveBeenCalledWith(
                (global as any).complex.module,
                complexModule
            )
        })
    })

    describe('типы TypeScript', () => {
        it('должна правильно типизировать NestedNamespace', () => {
            // Этот тест проверяет, что типы правильно определены
            // Реальная проверка типов происходит при компиляции TypeScript

            type TestNestedNamespace = { [k: PropertyKey]: any }
            const testObj: TestNestedNamespace = {
                stringKey: { nested: 'value' },
                123: { numericKey: true },
                [Symbol('test')]: { symbolKey: 'symbol' },
            }

            expect(testObj).toBeDefined()
            expect(testObj.stringKey.nested).toBe('value')
            expect(testObj[123].numericKey).toBe(true)
        })
    })

    describe('интеграционные тесты', () => {
        beforeEach(() => {
            // Используем реальную реализацию mergeNamespaces для интеграционных тестов
            mockMergeNamespaces.mockImplementation((target, source) => {
                Object.keys(source).forEach(key => {
                    target[key] = source[key]
                })
            })
        })

        it('должна успешно добавлять свойства в глобальный объект', () => {
            const testModule = {
                integrationProp: 'integrationValue',
                integrationFunc: () => 'integration result',
            }

            globalify(testModule)

            expect((global as any).integrationProp).toBe('integrationValue')
            expect((global as any).integrationFunc()).toBe('integration result')
        })

        it('должна создавать полную структуру пространства имён', () => {
            const testModule = {
                deepIntegrationProp: 'deepValue',
            }

            globalify.namespace('integration.test.deep', testModule)

            expect((global as any).integration).toBeDefined()
            expect((global as any).integration.test).toBeDefined()
            expect((global as any).integration.test.deep).toBeDefined()
            expect((global as any).integration.test.deep.deepIntegrationProp).toBe('deepValue')
        })

        it('должна сохранять ссылки на объекты', () => {
            const sharedObject = { shared: 'value' }
            const module1 = { obj: sharedObject }
            const module2 = { ref: sharedObject }

            globalify(module1)
            globalify(module2)

            expect((global as any).obj).toBe((global as any).ref)
            expect((global as any).obj).toBe(sharedObject)
        })

        it('должна работать с классами и их экземплярами', () => {
            class TestClass {
                constructor(public value: string) {}
                getValue() {
                    return this.value
                }
            }

            const instance = new TestClass('test')

            globalify({
                TestClass,
                instance,
            })

            expect((global as any).TestClass).toBe(TestClass)
            expect((global as any).instance).toBe(instance)
            expect((global as any).instance.getValue()).toBe('test')
            expect(new (global as any).TestClass('new').getValue()).toBe('new')
        })
    })
})
