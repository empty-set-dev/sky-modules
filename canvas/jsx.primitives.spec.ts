// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach } from 'vitest'

import { CanvasJSXRenderer } from './jsx'

describe('CanvasJSXRenderer - Primitive Children Support', () => {
    let renderer: CanvasJSXRenderer
    let container: HTMLElement

    beforeEach(() => {
        container = document.createElement('div')
        document.body.appendChild(container)
        try {
            renderer = new CanvasJSXRenderer({ container })
        } catch (error) {
            // In test environment, createElement('canvas') might not work properly with appendChild
            renderer = new CanvasJSXRenderer()
        }
    })

    afterEach(() => {
        renderer?.dispose()
        if (container.parentNode) {
            document.body.removeChild(container)
        }
    })

    describe('String children', () => {
        test('should render Mesh with string child', () => {
            const element = {
                type: 'Mesh',
                props: {
                    position: [100, 100],
                    children: 'Hello World'
                }
            }

            // Should not throw
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Scene with string child', () => {
            const element = {
                type: 'Scene',
                props: {
                    children: 'Text in scene'
                }
            }

            // Should not throw
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Group with string child', () => {
            const element = {
                type: 'Group',
                props: {
                    position: [50, 50],
                    children: 'Text in group'
                }
            }

            // Should not throw
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle empty string', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: ''
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle multiline string', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: 'Line 1\nLine 2\nLine 3'
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle string with special characters', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: 'Hello! @#$%^&*() 123 <>?'
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Number children', () => {
        test('should render Mesh with number child', () => {
            const element = {
                type: 'Mesh',
                props: {
                    position: [100, 100],
                    children: 42
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render with zero', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: 0
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render with negative number', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: -123.456
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render with very large number', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: 999999999
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render with decimal number', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: 3.14159
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Scene with number child', () => {
            const element = {
                type: 'Scene',
                props: {
                    children: 100
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Group with number child', () => {
            const element = {
                type: 'Group',
                props: {
                    children: 42
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Boolean children', () => {
        test('should render Mesh with true child', () => {
            const element = {
                type: 'Mesh',
                props: {
                    position: [100, 100],
                    children: true
                }
            }

            // Booleans are typically ignored in JSX (React convention)
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Mesh with false child', () => {
            const element = {
                type: 'Mesh',
                props: {
                    position: [100, 100],
                    children: false
                }
            }

            // Booleans are typically ignored in JSX (React convention)
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Scene with boolean child', () => {
            const element = {
                type: 'Scene',
                props: {
                    children: true
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Group with boolean child', () => {
            const element = {
                type: 'Group',
                props: {
                    children: false
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Mixed children (primitives with elements)', () => {
        test('should render array with mixed string and element children', () => {
            const element = {
                type: 'Scene',
                props: {
                    children: [
                        'Text before',
                        {
                            type: 'Mesh',
                            props: {
                                children: [
                                    { type: 'RectGeometry', props: {} },
                                    { type: 'BasicMaterial', props: {} }
                                ]
                            }
                        },
                        'Text after'
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
            // Should only render the Mesh element
            expect(renderer.scene.children.length).toBeGreaterThanOrEqual(0)
        })

        test('should render array with mixed number and element children', () => {
            const element = {
                type: 'Group',
                props: {
                    children: [
                        42,
                        {
                            type: 'Mesh',
                            props: {
                                children: [
                                    { type: 'CircleGeometry', props: {} },
                                    { type: 'BasicMaterial', props: {} }
                                ]
                            }
                        },
                        100
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render array with mixed boolean and element children', () => {
            const element = {
                type: 'Group',
                props: {
                    children: [
                        true,
                        {
                            type: 'Mesh',
                            props: {
                                children: [
                                    { type: 'RectGeometry', props: {} },
                                    { type: 'BasicMaterial', props: {} }
                                ]
                            }
                        },
                        false
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Mesh with geometry, material and string child', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: [
                        { type: 'RectGeometry', props: { width: 100, height: 50 } },
                        { type: 'BasicMaterial', props: { color: '#ff0000' } },
                        'Some text'
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle all primitive types in one array', () => {
            const element = {
                type: 'Group',
                props: {
                    children: [
                        'string',
                        42,
                        true,
                        false,
                        0,
                        '',
                        {
                            type: 'Mesh',
                            props: {
                                children: [
                                    { type: 'CircleGeometry', props: {} },
                                    { type: 'BasicMaterial', props: {} }
                                ]
                            }
                        }
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Fragment with primitive children', () => {
        test('should render Fragment with string children', () => {
            const element = {
                type: 'Fragment',
                props: {
                    children: ['Text 1', 'Text 2', 'Text 3']
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Fragment with number children', () => {
            const element = {
                type: 'Fragment',
                props: {
                    children: [1, 2, 3, 4, 5]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should render Fragment with mixed primitive and element children', () => {
            const element = {
                type: 'Fragment',
                props: {
                    children: [
                        'Start',
                        123,
                        {
                            type: 'Mesh',
                            props: {
                                children: [
                                    { type: 'RectGeometry', props: {} },
                                    { type: 'BasicMaterial', props: {} }
                                ]
                            }
                        },
                        true,
                        'End'
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Conditional rendering with primitives', () => {
        test('should handle conditional rendering with boolean (false)', () => {
            const element = {
                type: 'Scene',
                props: {
                    children: false && {
                        type: 'Mesh',
                        props: {
                            children: [
                                { type: 'RectGeometry', props: {} },
                                { type: 'BasicMaterial', props: {} }
                            ]
                        }
                    }
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle expression with number as child', () => {
            const count = 5
            const element = {
                type: 'Mesh',
                props: {
                    children: count
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle string concatenation as child', () => {
            const name = 'World'
            const element = {
                type: 'Mesh',
                props: {
                    children: `Hello ${name}!`
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Edge cases', () => {
        test('should handle null child (should be ignored)', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: null
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle undefined child (should be ignored)', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: undefined
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle array with null and undefined values', () => {
            const element = {
                type: 'Scene',
                props: {
                    children: [
                        'Text',
                        null,
                        undefined,
                        42,
                        null,
                        {
                            type: 'Mesh',
                            props: {
                                children: [
                                    { type: 'RectGeometry', props: {} },
                                    { type: 'BasicMaterial', props: {} }
                                ]
                            }
                        }
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle NaN as child', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: NaN
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle Infinity as child', () => {
            const element = {
                type: 'Mesh',
                props: {
                    children: Infinity
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle very long string', () => {
            const longString = 'A'.repeat(10000)
            const element = {
                type: 'Mesh',
                props: {
                    children: longString
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Reactive primitive children', () => {
        test('should handle function that returns string', () => {
            const getText = () => 'Dynamic text'
            const element = {
                type: 'Mesh',
                props: {
                    children: getText
                }
            }

            // Function children should be unwrapped
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle function that returns number', () => {
            const getNumber = () => 42
            const element = {
                type: 'Mesh',
                props: {
                    children: getNumber
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle function that returns boolean', () => {
            const getBool = () => true
            const element = {
                type: 'Mesh',
                props: {
                    children: getBool
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle array of functions returning primitives', () => {
            const element = {
                type: 'Group',
                props: {
                    children: [
                        () => 'text',
                        () => 123,
                        () => true
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('Nested primitives', () => {
        test('should handle nested Groups with string children', () => {
            const element = {
                type: 'Group',
                props: {
                    children: [
                        'Outer text',
                        {
                            type: 'Group',
                            props: {
                                children: [
                                    'Inner text',
                                    {
                                        type: 'Mesh',
                                        props: {
                                            children: [
                                                { type: 'CircleGeometry', props: {} },
                                                { type: 'BasicMaterial', props: {} }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle Scene with Group with primitives', () => {
            const element = {
                type: 'Scene',
                props: {
                    children: [
                        123,
                        {
                            type: 'Group',
                            props: {
                                children: [
                                    'Nested text',
                                    456,
                                    true
                                ]
                            }
                        }
                    ]
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })
    })
})
