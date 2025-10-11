// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach } from 'vitest'

import { CanvasJSXRenderer } from './jsx'

describe('CanvasJSXRenderer', () => {
    let renderer: CanvasJSXRenderer
    let container: HTMLElement

    beforeEach(() => {
        container = document.createElement('div')
        document.body.appendChild(container)
        renderer = new CanvasJSXRenderer({ container })
    })

    afterEach(() => {
        renderer.dispose()
        document.body.removeChild(container)
    })

    test('should create renderer with canvas', () => {
        expect(renderer).toBeDefined()
        expect(renderer.canvas).toBeDefined()
        expect(renderer.scene).toBeDefined()
        expect(renderer.canvas.domElement.tagName).toBe('CANVAS')
    })

    test('should render simple mesh', () => {
        const element = {
            type: 'mesh',
            props: {
                position: [100, 100],
                children: [
                    {
                        type: 'rectGeometry',
                        props: { width: 50, height: 50 }
                    },
                    {
                        type: 'basicMaterial',
                        props: { color: '#ff0000' }
                    }
                ]
            }
        }

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
    })

    test('should render scene with background', () => {
        const element = {
            type: 'scene',
            props: {
                background: '#000000',
                children: []
            }
        }

        renderer.render(element)
        expect(renderer.scene.background).toBe('#000000')
    })

    test('should render group with children', () => {
        const element = {
            type: 'group',
            props: {
                position: [50, 50],
                children: [
                    {
                        type: 'mesh',
                        props: {
                            children: [
                                {
                                    type: 'circleGeometry',
                                    props: { radius: 25 }
                                },
                                {
                                    type: 'basicMaterial',
                                    props: { color: '#00ff00' }
                                }
                            ]
                        }
                    }
                ]
            }
        }

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
        expect(renderer.scene.children[0].children).toHaveLength(1)
    })

    test('should handle update callbacks', () => {
        let updateCalled = false
        const element = {
            type: 'mesh',
            props: {
                onUpdate: () => {
                    updateCalled = true
                },
                children: [
                    {
                        type: 'rectGeometry',
                        props: { width: 50, height: 50 }
                    },
                    {
                        type: 'basicMaterial',
                        props: { color: '#ff0000' }
                    }
                ]
            }
        }

        renderer.render(element)

        // Simulate animation frame
        renderer['animate']()

        expect(updateCalled).toBe(true)
    })

    test('should create different geometry types', () => {
        const rectElement = {
            type: 'rectGeometry',
            props: { width: 100, height: 50, x: 10, y: 20 }
        }

        const circleElement = {
            type: 'circleGeometry',
            props: { radius: 30, x: 5, y: 10 }
        }

        const ellipseElement = {
            type: 'ellipseGeometry',
            props: { radiusX: 40, radiusY: 20 }
        }

        const rectGeometry = renderer['createGeometryOrMaterial'](rectElement)
        const circleGeometry = renderer['createGeometryOrMaterial'](circleElement)
        const ellipseGeometry = renderer['createGeometryOrMaterial'](ellipseElement)

        expect(rectGeometry).toBeDefined()
        expect(circleGeometry).toBeDefined()
        expect(ellipseGeometry).toBeDefined()
    })

    test('should create different material types', () => {
        const basicElement = {
            type: 'basicMaterial',
            props: { color: '#ff0000', opacity: 0.8 }
        }

        const strokeElement = {
            type: 'strokeMaterial',
            props: { color: '#00ff00', lineWidth: 3 }
        }

        const basicMaterial = renderer['createGeometryOrMaterial'](basicElement)
        const strokeMaterial = renderer['createGeometryOrMaterial'](strokeElement)

        expect(basicMaterial).toBeDefined()
        expect(strokeMaterial).toBeDefined()
    })

    test('should generate unique keys', () => {
        const key1 = renderer['generateKey']('mesh', { position: [0, 0] })
        const key2 = renderer['generateKey']('mesh', { position: [10, 10] })
        const key3 = renderer['generateKey']('group', { position: [0, 0] })

        expect(key1).not.toBe(key2)
        expect(key1).not.toBe(key3)
        expect(key2).not.toBe(key3)
    })

    test('should handle function components', () => {
        const FunctionComponent = (props: { color: string }) => ({
            type: 'mesh',
            props: {
                children: [
                    {
                        type: 'rectGeometry',
                        props: { width: 50, height: 50 }
                    },
                    {
                        type: 'basicMaterial',
                        props: { color: props.color }
                    }
                ]
            }
        })

        const element = {
            type: FunctionComponent,
            props: { color: '#ff0000' }
        }

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
    })

    test('should clear scene between renders', () => {
        const element1 = {
            type: 'mesh',
            props: {
                children: [
                    { type: 'rectGeometry', props: {} },
                    { type: 'basicMaterial', props: {} }
                ]
            }
        }

        const element2 = {
            type: 'group',
            props: {
                children: [
                    {
                        type: 'mesh',
                        props: {
                            children: [
                                { type: 'circleGeometry', props: {} },
                                { type: 'basicMaterial', props: {} }
                            ]
                        }
                    }
                ]
            }
        }

        renderer.render(element1)
        expect(renderer.scene.children).toHaveLength(1)

        renderer.render(element2)
        expect(renderer.scene.children).toHaveLength(1)
        expect(renderer.scene.children[0].children).toHaveLength(1)
    })

    test('should handle invalid element types', () => {
        renderer.render({
            type: 'invalidElement',
            props: {}
        })

        expect(renderer.scene.children.length).toBe(0)
    })

    test('should handle nested groups', () => {
        renderer.render({
            type: 'group',
            props: {
                position: [10, 20],
                children: [
                    {
                        type: 'group',
                        props: {
                            position: [5, 5],
                            children: [
                                {
                                    type: 'mesh',
                                    props: {
                                        children: [
                                            { type: 'circleGeometry', props: { radius: 10 } },
                                            { type: 'basicMaterial', props: { color: '#blue' } }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        })

        expect(renderer.scene.children.length).toBe(1)
        const group = renderer.scene.children[0]
        expect(group.children.length).toBe(1)
        expect(group.children[0].children.length).toBe(1)
    })

    test('should handle all material types', () => {
        renderer.render([
            {
                type: 'mesh',
                props: {
                    children: [
                        { type: 'rectGeometry', props: {} },
                        { type: 'strokeMaterial', props: { color: '#ff0000' } }
                    ]
                }
            },
            {
                type: 'mesh',
                props: {
                    children: [
                        { type: 'ellipseGeometry', props: {} },
                        { type: 'patternMaterial', props: {} }
                    ]
                }
            }
        ])

        expect(renderer.scene.children.length).toBe(2)
    })

    test('should handle empty children arrays', () => {
        renderer.render({
            type: 'group',
            props: {
                children: []
            }
        })

        expect(renderer.scene.children.length).toBe(1)
        expect(renderer.scene.children[0].children.length).toBe(0)
    })
})