import '@sky-modules/platform/node'
import '@sky-modules/core/runtime'

// NOTE: Do NOT set RuntimeInternal.isRuntime = true here
// because define() throws RuntimeDefineError when called at runtime
// These tests need to run before runtime to test define registration

import '@sky-modules/core/define'
import '@sky-modules/core/define/global'
import { describe, test, expect } from 'vitest'

import Internal from '../internal/internal'

describe('define system', () => {
    describe('define decorator for classes', () => {
        test('registers class in global registry', () => {
            @define('test.DefineClass1')
            class TestClass {
                @string name = 'test'
            }

            const definition = Internal.defines['test.DefineClass1']
            expect(definition).toBeDefined()
            expect(definition.name).toBe('test.DefineClass1')
            expect(definition.value).toBe(TestClass)
        })

        test('adds metadata symbols to class', () => {
            @define('test.DefineClass2')
            class TestClass {}

            expect(TestClass[Internal.typeSymbol]).toBe('class')
            expect(TestClass[Internal.nameSymbol]).toBe('TestClass')
            expect(TestClass[Internal.uidSymbol]).toBe('test.DefineClass2')
        })

        test('creates reactive property descriptors', () => {
            @define('test.DefineClass3')
            class TestClass {
                @string name = ''
                @number age = 0
            }

            const instance = new TestClass()
            const nameDesc = Object.getOwnPropertyDescriptor(TestClass.prototype, 'name')
            const ageDesc = Object.getOwnPropertyDescriptor(TestClass.prototype, 'age')

            expect(nameDesc?.get).toBeDefined()
            expect(nameDesc?.set).toBeDefined()
            expect(ageDesc?.get).toBeDefined()
            expect(ageDesc?.set).toBeDefined()
        })

        test('initializes schema on prototype', () => {
            @define('test.DefineClass4')
            class TestClass {
                @string name
                @number age
            }

            expect(TestClass.prototype.schema).toBeDefined()
            expect(TestClass.prototype.schema.name).toBe(string)
            expect(TestClass.prototype.schema.age).toBe(number)
        })

        test('prevents duplicate definitions', () => {
            @define('test.DuplicateClass')
            class FirstClass {}

            expect(() => {
                @define('test.DuplicateClass')
                class SecondClass {}
            }).toThrow('Duplicate define')
        })

        test('extracts short name from namespaced path', () => {
            @define('app.entities.game.Player')
            class Player {}

            expect(Player[Internal.nameSymbol]).toBe('Player')
        })
    })

    describe('define function for objects', () => {
        test('registers object in global registry', () => {
            const config = { apiUrl: 'https://api.example.com' }
            define('test.Config1', config)

            const definition = Internal.defines['test.Config1']
            expect(definition).toBeDefined()
            expect(definition.name).toBe('test.Config1')
            expect(definition.value).toBe(config)
        })

        test('adds metadata symbols to object', () => {
            const config = { apiUrl: 'https://api.example.com' }
            define('test.Config2', config)

            expect(config[Internal.typeSymbol]).toBe('object')
            expect(config[Internal.nameSymbol]).toBe('Config2')
            expect(config[Internal.uidSymbol]).toBe('test.Config2')
        })

        test('handles arrays correctly', () => {
            const items = [1, 2, 3]
            define('test.Items', items)

            expect(items[Internal.typeSymbol]).toBe('array')
        })

        test('returns the registered value', () => {
            const config = { key: 'value' }
            const result = define('test.Config3', config)

            expect(result).toBe(config)
        })
    })

    describe('define function for functions', () => {
        test('registers function in global registry', () => {
            function helper() {
                return 'help'
            }
            define('test.Helper1', helper)

            const definition = Internal.defines['test.Helper1']
            expect(definition).toBeDefined()
            expect(definition.name).toBe('test.Helper1')
            expect(definition.value).toBe(helper)
        })

        test('adds metadata symbols to function', () => {
            function helper() {
                return 'help'
            }
            define('test.Helper2', helper)

            expect(helper[Internal.typeSymbol]).toBe('func')
            expect(helper[Internal.nameSymbol]).toBe('Helper2')
            expect(helper[Internal.uidSymbol]).toBe('test.Helper2')
        })
    })

    describe('schema function', () => {
        test('creates schema object with constructor', () => {
            const AddressSchema = schema('test.Address1', {
                street: string,
                city: string,
                country: string,
            })

            expect(AddressSchema[Internal.constructorSymbol]).toBeDefined()
            expect(typeof AddressSchema[Internal.constructorSymbol]).toBe('function')
        })

        test('registers schema in global registry', () => {
            const PersonSchema = schema('test.Person1', {
                name: string,
                age: number,
            })

            const definition = Internal.defines['test.Person1']
            expect(definition).toBeDefined()
            expect(definition.name).toBe('test.Person1')
        })

        test('adds metadata to schema constructor', () => {
            const PersonSchema = schema('test.Person2', {
                name: string,
                age: number,
            })

            const constructor = PersonSchema[Internal.constructorSymbol]
            expect(constructor[Internal.nameSymbol]).toBe('Person2')
            expect(constructor[Internal.uidSymbol]).toBe('test.Person2')
        })

        test('throws error for non-object schema', () => {
            expect(() => {
                schema('test.Invalid1', [] as any)
            }).toThrow('Invalid define name')

            expect(() => {
                schema('test.Invalid2', 'string' as any)
            }).toThrow('Invalid define name')
        })
    })

    describe('property decorators', () => {
        test('@string decorator works', () => {
            @define('test.StringTest')
            class TestClass {
                @string name = 'Anna'
            }

            const instance = new TestClass()
            expect(instance.name).toBe('Anna')

            instance.name = 'Bob'
            expect(instance.name).toBe('Bob')
        })

        test('@number decorator works', () => {
            @define('test.NumberTest')
            class TestClass {
                @number count = 42
            }

            const instance = new TestClass()
            expect(instance.count).toBe(42)

            instance.count = 100
            expect(instance.count).toBe(100)
        })

        test('@boolean decorator works', () => {
            @define('test.BooleanTest')
            class TestClass {
                @boolean active = true
            }

            const instance = new TestClass()
            expect(instance.active).toBe(true)

            instance.active = false
            expect(instance.active).toBe(false)
        })

        test('@optional decorators work', () => {
            @define('test.OptionalTest')
            class TestClass {
                @optional.string nickname?: string
                @optional.number score?: number
            }

            const instance = new TestClass()
            expect(instance.nickname).toBeUndefined()
            expect(instance.score).toBeUndefined()

            instance.nickname = 'Test'
            instance.score = 100
            expect(instance.nickname).toBe('Test')
            expect(instance.score).toBe(100)
        })

        test('@nullable decorators work', () => {
            @define('test.NullableTest')
            class TestClass {
                @nullable.string avatar = null
                @nullable.number lastSeen = null
            }

            const instance = new TestClass()
            expect(instance.avatar).toBeNull()
            expect(instance.lastSeen).toBeNull()

            instance.avatar = 'avatar.png'
            instance.lastSeen = 12345
            expect(instance.avatar).toBe('avatar.png')
            expect(instance.lastSeen).toBe(12345)
        })
    })

    describe('nested objects', () => {
        test('@object decorator with class', () => {
            @define('test.NestedAddress')
            class Address {
                @string street = ''
                @string city = ''
            }

            @define('test.NestedUser')
            class User {
                @string name = ''
                @object(Address) address!: Address
            }

            const user = new User()
            user.address = new Address()
            user.address.street = 'Main St'

            expect(user.address.street).toBe('Main St')
        })

        test('@array decorator', () => {
            @define('test.ArrayItem')
            class Item {
                @string name = ''
            }

            @define('test.ArrayContainer')
            class Container {
                @array(Item) items: Item[] = []
            }

            const container = new Container()
            expect(Array.isArray(container.items)).toBe(true)
        })
    })

    describe('validation and security', () => {
        test('throws InvalidDefineNameError for empty name', () => {
            expect(() => {
                define('', {})
            }).toThrow('Invalid define name')
        })

        test('throws InvalidDefineNameError for invalid characters', () => {
            expect(() => {
                define('test-invalid', {})
            }).toThrow('Invalid define name')

            expect(() => {
                define('test$invalid', {})
            }).toThrow('Invalid define name')

            expect(() => {
                define('123invalid', {})
            }).toThrow('Invalid define name')
        })

        test('accepts valid define names', () => {
            expect(() => {
                define('ValidName', {})
                define('valid_name', {})
                define('valid.name.path', {})
                define('valid.Name123', {})
            }).not.toThrow()
        })

        test('throws DuplicateDefineError for duplicate names', () => {
            define('test.Unique1', {})

            expect(() => {
                define('test.Unique1', {})
            }).toThrow('Duplicate define')
        })

        test('schema validates name format', () => {
            expect(() => {
                schema('', { value: string })
            }).toThrow('Invalid define name')

            expect(() => {
                schema('invalid-name', { value: string })
            }).toThrow('Invalid define name')
        })

        test('schema rejects non-object values', () => {
            expect(() => {
                schema('test.InvalidSchema1', [] as any)
            }).toThrow('Invalid define name')

            expect(() => {
                schema('test.InvalidSchema2', null as any)
            }).toThrow()
        })
    })

    describe('complex scenarios', () => {
        test('multiple classes with different schemas', () => {
            @define('test.Complex1.User')
            class User {
                @string name = ''
                @number age = 0
            }

            @define('test.Complex1.Post')
            class Post {
                @string title = ''
                @string content = ''
                @number likes = 0
            }

            const user = new User()
            user.name = 'Anna'
            user.age = 25

            const post = new Post()
            post.title = 'Hello'
            post.likes = 42

            expect(user.name).toBe('Anna')
            expect(post.title).toBe('Hello')
            expect(Internal.defines['test.Complex1.User']).toBeDefined()
            expect(Internal.defines['test.Complex1.Post']).toBeDefined()
        })

        test('inheritance preserves schema', () => {
            @define('test.InheritBase')
            class Base {
                @string name = ''
            }

            @define('test.InheritDerived')
            class Derived extends Base {
                @number value = 0
            }

            const instance = new Derived()
            instance.name = 'Test'
            instance.value = 42

            expect(instance.name).toBe('Test')
            expect(instance.value).toBe(42)
        })
    })
})
