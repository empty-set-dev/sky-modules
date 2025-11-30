// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createSignal, createRoot } from 'solid-js'

import { CanvasJSXRenderer, Scene, Mesh, RectGeometry, BasicMaterial } from '../../jsx/jsx'

describe('CanvasJSXRenderer Reactivity', () => {
    let renderer: CanvasJSXRenderer
    let dispose: (() => void) | null = null

    beforeEach(() => {
        renderer = new CanvasJSXRenderer()
    })

    afterEach(() => {
        renderer.dispose()
        if (dispose) {
            dispose()
            dispose = null
        }
    })

    test('should render initial reactive content', async () => {
        await new Promise<void>((resolve) => {
            dispose = createRoot((d) => {
                const [x] = createSignal(100)

                renderer.render(() => ({
                    type: 'Scene',
                    props: {
                        children: [
                            {
                                type: 'Mesh',
                                props: {
                                    position: [x(), 50],
                                    children: [
                                        { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                        { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                    ]
                                },
                                key: ''
                            }
                        ]
                    },
                    key: ''
                }))

                // Give Solid.js time to execute effects
                setTimeout(() => {
                    expect(renderer.scene.children.length).toBe(1)
                    resolve()
                }, 50)

                return d
            })
        })
    })

    test('should update when signal changes', async () => {
        await new Promise<void>((resolve) => {
            dispose = createRoot((d) => {
                const [x, setX] = createSignal(100)

                renderer.render(() => ({
                    type: 'Scene',
                    props: {
                        children: [
                            {
                                type: 'Mesh',
                                props: {
                                    position: [x(), 50],
                                    children: [
                                        { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                        { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                    ]
                                },
                                key: ''
                            }
                        ]
                    },
                    key: ''
                }))

                setTimeout(() => {
                    const initialMesh = renderer.scene.children[0]
                    expect(initialMesh).toBeDefined()

                    if (initialMesh) {
                        expect(initialMesh.position.x).toBe(100)

                        // Change signal
                        setX(200)

                        setTimeout(() => {
                            expect(initialMesh.position.x).toBe(200)
                            resolve()
                        }, 50)
                    } else {
                        resolve()
                    }
                }, 50)

                return d
            })
        })
    })

    test('should handle multiple reactive signals', async () => {
        await new Promise<void>((resolve) => {
            dispose = createRoot((d) => {
                const [x, setX] = createSignal(100)
                const [y, setY] = createSignal(50)

                renderer.render(() => ({
                    type: 'Scene',
                    props: {
                        children: [
                            {
                                type: 'Mesh',
                                props: {
                                    position: [x(), y()],
                                    children: [
                                        { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                        { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                    ]
                                },
                                key: ''
                            }
                        ]
                    },
                    key: ''
                }))

                setTimeout(() => {
                    const mesh = renderer.scene.children[0]
                    expect(mesh).toBeDefined()

                    if (mesh) {
                        expect(mesh.position.x).toBe(100)
                        expect(mesh.position.y).toBe(50)

                        setX(200)
                        setY(100)

                        setTimeout(() => {
                            expect(mesh.position.x).toBe(200)
                            expect(mesh.position.y).toBe(100)
                            resolve()
                        }, 50)
                    } else {
                        resolve()
                    }
                }, 50)

                return d
            })
        })
    })

    test('should handle conditional rendering', async () => {
        await new Promise<void>((resolve) => {
            dispose = createRoot((d) => {
                const [show, setShow] = createSignal(true)

                renderer.render(() => ({
                    type: 'Scene',
                    props: {
                        children: show() ? [
                            {
                                type: 'Mesh',
                                props: {
                                    position: [100, 50],
                                    children: [
                                        { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                        { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                    ]
                                },
                                key: ''
                            }
                        ] : []
                    },
                    key: ''
                }))

                setTimeout(() => {
                    expect(renderer.scene.children.length).toBe(1)

                    setShow(false)

                    setTimeout(() => {
                        expect(renderer.scene.children.length).toBe(0)
                        resolve()
                    }, 50)
                }, 50)

                return d
            })
        })
    })

    test('should handle dynamic list rendering', async () => {
        await new Promise<void>((resolve) => {
            dispose = createRoot((d) => {
                const [items, setItems] = createSignal([1, 2, 3])

                renderer.render(() => ({
                    type: 'Scene',
                    props: {
                        children: items().map((item) => ({
                            type: 'Mesh',
                            props: {
                                position: [item * 100, 50],
                                children: [
                                    { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                    { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                ]
                            },
                            key: ''
                        }))
                    },
                    key: ''
                }))

                setTimeout(() => {
                    expect(renderer.scene.children.length).toBe(3)

                    setItems([1, 2, 3, 4, 5])

                    setTimeout(() => {
                        expect(renderer.scene.children.length).toBe(5)
                        resolve()
                    }, 50)
                }, 50)

                return d
            })
        })
    })

    test('should handle non-reactive render after reactive', async () => {
        await new Promise<void>((resolve) => {
            dispose = createRoot((d) => {
                const [x, setX] = createSignal(100)

                // First reactive render
                renderer.render(() => ({
                    type: 'Scene',
                    props: {
                        children: [
                            {
                                type: 'Mesh',
                                props: {
                                    position: [x(), 50],
                                    children: [
                                        { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                        { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                    ]
                                },
                                key: ''
                            }
                        ]
                    },
                    key: ''
                }))

                setTimeout(() => {
                    const mesh1 = renderer.scene.children[0]
                    expect(mesh1.position.x).toBe(100)

                    // Now render non-reactively
                    renderer.render({
                        type: 'Scene',
                        props: {
                            children: [
                                {
                                    type: 'Mesh',
                                    props: {
                                        position: [300, 150],
                                        children: [
                                            { type: 'RectGeometry', props: { width: 100, height: 100 }, key: '' },
                                            { type: 'BasicMaterial', props: { color: '#00ff00' }, key: '' }
                                        ]
                                    },
                                    key: ''
                                }
                            ]
                        },
                        key: ''
                    })

                    setTimeout(() => {
                        const mesh2 = renderer.scene.children[0]
                        expect(mesh2.position.x).toBe(300)

                        // Signal change should not affect non-reactive render
                        setX(500)

                        setTimeout(() => {
                            expect(mesh2.position.x).toBe(300)
                            resolve()
                        }, 50)
                    }, 50)
                }, 50)

                return d
            })
        })
    })

    test('should handle nested reactive values', async () => {
        await new Promise<void>((resolve) => {
            dispose = createRoot((d) => {
                const [config, setConfig] = createSignal({ x: 100, y: 50, size: 50 })

                renderer.render(() => {
                    const c = config()
                    return {
                        type: 'Scene',
                        props: {
                            children: [
                                {
                                    type: 'Mesh',
                                    props: {
                                        position: [c.x, c.y],
                                        children: [
                                            { type: 'RectGeometry', props: { width: c.size, height: c.size }, key: '' },
                                            { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                        ]
                                    },
                                    key: ''
                                }
                            ]
                        },
                        key: ''
                    }
                })

                setTimeout(() => {
                    const mesh = renderer.scene.children[0]
                    expect(mesh.position.x).toBe(100)

                    setConfig({ x: 200, y: 100, size: 75 })

                    setTimeout(() => {
                        expect(mesh.position.x).toBe(200)
                        expect(mesh.position.y).toBe(100)
                        resolve()
                    }, 50)
                }, 50)

                return d
            })
        })
    })

    test('should properly dispose reactive effects', () => {
        dispose = createRoot((d) => {
            const [x, setX] = createSignal(100)

            renderer.render(() => ({
                type: Scene,
                props: {
                    children: [
                        {
                            type: Mesh,
                            props: {
                                position: [x(), 50],
                                children: [
                                    { type: RectGeometry, props: { width: 50, height: 50 }, key: '' },
                                    { type: BasicMaterial, props: { color: '#ff0000' }, key: '' }
                                ]
                            },
                            key: ''
                        }
                    ]
                },
                key: ''
            }))

            renderer.dispose()

            // After disposal, signal changes should not cause updates
            expect(() => setX(200)).not.toThrow()

            return d
        })
    })

    test('should work with functional components returning reactive functions', async () => {
        await new Promise<void>((resolve) => {
            const [x, setX] = createSignal(100)

            function TestComponent() {
                // Return a function that creates JSX - will be called reactively
                return () => ({
                    type: 'Scene',
                    props: {
                        children: [
                            {
                                type: 'Mesh',
                                props: {
                                    position: [x(), 50],
                                    children: [
                                        { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                        { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                    ]
                                },
                                key: ''
                            }
                        ]
                    },
                    key: ''
                })
            }

            dispose = createRoot((d) => {
                // Call component once and get the reactive function
                const renderFn = TestComponent()
                renderer.render(() => renderFn)

                setTimeout(() => {
                    const mesh = renderer.scene.children[0]
                    expect(mesh).toBeDefined()
                    expect(mesh.position.x).toBe(100)

                    // Change signal
                    setX(200)

                    setTimeout(() => {
                        expect(mesh.position.x).toBe(200)
                        resolve()
                    }, 50)
                }, 50)

                return d
            })
        })
    })

    test('should work with functional components returning JSX directly', async () => {
        await new Promise<void>((resolve) => {
            let setX: ((value: number) => void) | null = null

            function TestComponent() {
                const [x, setXInternal] = createSignal(100)
                setX = setXInternal

                // Return JSX directly (not a function)
                // Signal will be tracked when component is called inside render function
                return {
                    type: 'Scene',
                    props: {
                        children: [
                            {
                                type: 'Mesh',
                                props: {
                                    position: [x(), 50],
                                    children: [
                                        { type: 'RectGeometry', props: { width: 50, height: 50 }, key: '' },
                                        { type: 'BasicMaterial', props: { color: '#ff0000' }, key: '' }
                                    ]
                                },
                                key: ''
                            }
                        ]
                    },
                    key: ''
                }
            }

            dispose = createRoot((d) => {
                renderer.render(() => TestComponent())

                setTimeout(() => {
                    const mesh = renderer.scene.children[0]
                    expect(mesh).toBeDefined()
                    expect(mesh.position.x).toBe(100)

                    // Change signal - should trigger re-render
                    if (setX) {
                        setX(200)

                        setTimeout(() => {
                            // This won't update because JSX is created only once
                            // Component needs to return a function for reactivity
                            expect(mesh.position.x).toBe(100) // Still 100
                            resolve()
                        }, 50)
                    } else {
                        resolve()
                    }
                }, 50)

                return d
            })
        })
    })
})
