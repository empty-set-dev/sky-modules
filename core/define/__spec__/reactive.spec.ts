import '@sky-modules/platform/node'
import '@sky-modules/core/runtime'
import '@sky-modules/core/define'
import '@sky-modules/core/define/global'
import { describe, test, expect, beforeAll } from 'vitest'
import { createEffect, createRoot, untrack } from 'solid-js/dist/solid.js'
import startRuntime from '@sky-modules/core/runtime/startRuntime'

// Define classes before runtime starts
@define('test.ReactiveUser')
class User {
    @string name = ''
    @number age = 0
}

@define('test.Counter')
class Counter {
    @number count = 0
}

@define('test.UntrackedUser')
class UntrackedUser {
    @string name = ''
}

@define('test.Person')
class Person {
    @string firstName = ''
    @string lastName = ''
}

describe('Solid.js reactivity integration', () => {
    beforeAll(async () => {
        await startRuntime()
    })

    test('property changes trigger Solid.js effects', () => {

        const user = new User()
        let effectRunCount = 0
        let lastSeenName = ''

        createRoot(() => {
            createEffect(() => {
                // Access reactive property - this should track it
                lastSeenName = user.name
                effectRunCount++
            })
        })

        // First run of effect (initial)
        expect(effectRunCount).toBe(1)
        expect(lastSeenName).toBe('')

        // Change the property - should trigger effect
        user.name = 'Alice'

        // Solid.js effects run synchronously
        expect(effectRunCount).toBe(2)
        expect(lastSeenName).toBe('Alice')

        user.name = 'Bob'

        expect(effectRunCount).toBe(3)
        expect(lastSeenName).toBe('Bob')
    })

    test('number properties are reactive', () => {
        const counter = new Counter()
        let doubleValue = 0

        createRoot(() => {
            createEffect(() => {
                doubleValue = counter.count * 2
            })
        })

        expect(doubleValue).toBe(0)

        counter.count = 5

        expect(doubleValue).toBe(10)
    })

    test('untrack prevents reactivity', () => {
        const user = new UntrackedUser()
        let effectRuns = 0

        createRoot(() => {
            createEffect(() => {
                // Access in untrack - should not track
                untrack(() => {
                    const _name = user.name
                })
                effectRuns++
            })
        })

        expect(effectRuns).toBe(1)

        user.name = 'Alice'

        // Effect should not have run again
        expect(effectRuns).toBe(1)
    })

    test('multiple properties are independently reactive', () => {
        const person = new Person()
        let fullName = ''
        let effectRuns = 0

        createRoot(() => {
            createEffect(() => {
                fullName = `${person.firstName} ${person.lastName}`
                effectRuns++
            })
        })

        expect(fullName).toBe(' ')
        expect(effectRuns).toBe(1)

        person.firstName = 'John'

        expect(fullName).toBe('John ')
        expect(effectRuns).toBe(2)

        person.lastName = 'Doe'

        expect(fullName).toBe('John Doe')
        expect(effectRuns).toBe(3)
    })
})
