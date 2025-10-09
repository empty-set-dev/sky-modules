import { Effect } from './Effect'
import { EffectThree } from './EffectThree'

function assertIsNotUndefined<T>(value: T, message: string): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(message)
    }
}

// DFS Pre-Order Iterator
export class DFSIterator implements Iterator<Effect> {
    private stack: Effect[] = []

    constructor(root: EffectThree) {
        if (!root['_children']) {
            return
        }

        for (const child of root['_children']) {
            this.stack.push(child)
        }
    }

    next(): IteratorResult<Effect> {
        if (this.stack.length === 0) {
            return { done: true, value: undefined }
        }

        const node = this.stack.pop()
        assertIsNotUndefined(node, 'DFSIterator ~ next: pop stack')

        if (node['_children']) {
            for (const child of node['_children']) {
                this.stack.push(child)
            }
        }

        return { done: false, value: node }
    }

    [Symbol.iterator](): Iterator<Effect> {
        return this
    }
}

// DFS Post-Order Iterator
export class DFSPostOrderIterator implements Iterator<Effect> {
    private stack: { effect: Effect; visited: boolean }[] = []

    constructor(root: EffectThree) {
        if (!root['_children']) {
            return
        }

        for (let i = root['_children'].length - 1; i >= 0; i--) {
            this.stack.push({ effect: root['_children'][i], visited: false })
        }
    }

    next(): IteratorResult<Effect> {
        while (this.stack.length > 0) {
            const current = this.stack[this.stack.length - 1]
            assertIsNotUndefined(current, 'DFSPostOrderIterator ~ next: current item')

            if (!current.visited) {
                current.visited = true

                if (current.effect['_children']) {
                    for (let i = current.effect['_children'].length - 1; i >= 0; i--) {
                        this.stack.push({
                            effect: current.effect['_children'][i],
                            visited: false,
                        })
                    }
                }
            } else {
                const popped = this.stack.pop()
                assertIsNotUndefined(popped, 'DFSPostOrderIterator ~ next: pop stack')
                return { done: false, value: popped.effect }
            }
        }

        return { done: true, value: undefined }
    }

    [Symbol.iterator](): Iterator<Effect> {
        return this
    }
}

// BFS Iterator
export class BFSIterator implements Iterator<Effect> {
    private queue: Effect[] = []

    constructor(root: EffectThree) {
        if (!root['_children']) {
            return
        }

        this.queue.push(...root['_children'])
    }

    next(): IteratorResult<Effect> {
        if (this.queue.length === 0) {
            return { done: true, value: undefined }
        }

        const effect = this.queue.shift()
        assertIsNotUndefined(effect, 'BFSIterator ~ next: shift queue')

        if (effect['_children']) {
            this.queue.push(...effect['_children'])
        }

        return { done: false, value: effect }
    }

    [Symbol.iterator](): Iterator<Effect> {
        return this
    }
}

// Tree traversal with generators
export class EffectThreeTraversal {
    constructor(private root: EffectThree) {}

    // DFS Pre-Order
    *dfsPreOrder(): Generator<Effect> {
        if (!this.root['_children']) {
            return
        }

        for (const child of this.root['_children']) {
            yield* this.dfsPreOrderHelper(child)
        }
    }

    private *dfsPreOrderHelper(effect: Effect): Generator<Effect> {
        yield effect

        if (effect['_children']) {
            for (const child of effect['_children']) {
                yield* this.dfsPreOrderHelper(child)
            }
        }
    }

    // DFS Post-Order
    *dfsPostOrder(): Generator<Effect> {
        if (!this.root['_children']) {
            return
        }

        for (const child of this.root['_children']) {
            yield* this.dfsPostOrderHelper(child)
        }
    }

    private *dfsPostOrderHelper(effect: Effect): Generator<Effect> {
        if (effect['_children']) {
            for (const child of effect['_children']) {
                yield* this.dfsPostOrderHelper(child)
            }
        }

        yield effect
    }

    // BFS
    *bfs(): Generator<Effect> {
        if (!this.root['_children']) {
            return
        }

        const queue: Effect[] = [...this.root['_children']]

        while (queue.length > 0) {
            const effect = queue.shift()
            assertIsNotUndefined(effect, 'EffectTraversal ~ bfs: shift queue')
            yield effect

            if (effect['_children']) {
                queue.push(...effect['_children'])
            }
        }
    }

    // BFS with levels (starting from 0 for first level children)
    *bfsWithLevel(): Generator<{ effect: Effect; level: number }> {
        if (!this.root['_children']) {
            return
        }

        const queue: { effect: Effect; level: number }[] = this.root['_children'].map(child => ({
            effect: child,
            level: 0,
        }))

        while (queue.length > 0) {
            const item = queue.shift()
            assertIsNotUndefined(item, 'EffectTraversal ~ bfsWithLevel: shift queue')

            const { effect, level } = item
            yield { effect, level }

            if (effect['_children']) {
                for (const child of effect['_children']) {
                    queue.push({ effect: child, level: level + 1 })
                }
            }
        }
    }

    // Default iterator
    [Symbol.iterator](): Generator<Effect> {
        return this.dfsPreOrder()
    }
}
