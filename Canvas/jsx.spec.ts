// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach } from 'vitest'

import { CanvasJSXRenderer, Scene, Mesh, RectGeometry, BasicMaterial } from './jsx'

describe('CanvasJSXRenderer', () => {
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

    test('should create renderer with canvas', () => {
        expect(renderer).toBeDefined()
        expect(renderer.canvas).toBeDefined()
        expect(renderer.scene).toBeDefined()
        expect(renderer.canvas.domElement.tagName).toBe('CANVAS')
    })

    test('should render simple mesh', () => {
        const element = {
            type: 'Mesh',
            props: {
                position: [100, 100],
                children: [
                    {
                        type: 'RectGeometry',
                        props: { width: 50, height: 50 }
                    },
                    {
                        type: 'BasicMaterial',
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
            type: 'Scene',
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
            type: 'Group',
            props: {
                position: [50, 50],
                children: [
                    {
                        type: 'Mesh',
                        props: {
                            children: [
                                {
                                    type: 'CircleGeometry',
                                    props: { radius: 25 }
                                },
                                {
                                    type: 'BasicMaterial',
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
            type: 'Mesh',
            props: {
                onUpdate: () => {
                    updateCalled = true
                },
                children: [
                    {
                        type: 'RectGeometry',
                        props: { width: 50, height: 50 }
                    },
                    {
                        type: 'BasicMaterial',
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
            type: 'RectGeometry',
            props: { width: 100, height: 50, x: 10, y: 20 }
        }

        const circleElement = {
            type: 'CircleGeometry',
            props: { radius: 30, x: 5, y: 10 }
        }

        const ellipseElement = {
            type: 'EllipseGeometry',
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
            type: 'BasicMaterial',
            props: { color: '#ff0000', opacity: 0.8 }
        }

        const strokeElement = {
            type: 'StrokeMaterial',
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
            type: 'Mesh',
            props: {
                children: [
                    {
                        type: 'RectGeometry',
                        props: { width: 50, height: 50 }
                    },
                    {
                        type: 'BasicMaterial',
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
            type: 'Mesh',
            props: {
                children: [
                    { type: 'RectGeometry', props: {} },
                    { type: 'BasicMaterial', props: {} }
                ]
            }
        }

        const element2 = {
            type: 'Group',
            props: {
                children: [
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
            type: 'Group',
            props: {
                position: [10, 20],
                children: [
                    {
                        type: 'Group',
                        props: {
                            position: [5, 5],
                            children: [
                                {
                                    type: 'Mesh',
                                    props: {
                                        children: [
                                            { type: 'CircleGeometry', props: { radius: 10 } },
                                            { type: 'BasicMaterial', props: { color: '#blue' } }
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
                type: 'Mesh',
                props: {
                    children: [
                        { type: 'RectGeometry', props: {} },
                        { type: 'StrokeMaterial', props: { color: '#ff0000' } }
                    ]
                }
            },
            {
                type: 'Mesh',
                props: {
                    children: [
                        { type: 'EllipseGeometry', props: {} },
                        { type: 'BasicMaterial', props: {} }
                    ]
                }
            }
        ])

        expect(renderer.scene.children.length).toBe(2)
    })

    test('should handle empty children arrays', () => {
        renderer.render({
            type: 'Group',
            props: {
                children: []
            }
        })

        expect(renderer.scene.children.length).toBe(1)
        expect(renderer.scene.children[0].children.length).toBe(0)
    })

    test('should render JSX function components', () => {
        const element = Scene({
            background: '#000000',
            children: [
                Mesh({
                    position: [100, 100],
                    children: [
                        RectGeometry({ width: 50, height: 50 }),
                        BasicMaterial({ color: '#ff0000' })
                    ]
                })
            ]
        })

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
        expect(renderer.scene.background).toBe('#000000')
    })

    test('should handle null elements', () => {
        expect(() => renderer.render(null)).toThrow()
    })

    test('should handle undefined elements', () => {
        expect(() => renderer.render(undefined)).toThrow()
    })

    test('should handle elements without props', () => {
        const element = { type: 'Scene' }
        expect(() => renderer.render(element)).toThrow()
    })

    test('should handle empty array render', () => {
        renderer.render([])
        expect(renderer.scene.children).toHaveLength(0)
    })

    test('should handle array with null elements', () => {
        renderer.render([null, undefined])
        expect(renderer.scene.children).toHaveLength(0)
    })

    test('should handle nested function components', () => {
        const NestedComponent = () => Mesh({
            children: [
                RectGeometry({}),
                BasicMaterial({ color: '#green' })
            ]
        })

        const element = {
            type: NestedComponent,
            props: {}
        }

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
    })

    test('should handle mesh without geometry or material', () => {
        const element = {
            type: 'Mesh',
            props: {
                position: [0, 0],
                children: []
            }
        }

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
    })

    test('should handle mesh with only geometry', () => {
        const element = {
            type: 'Mesh',
            props: {
                children: [
                    { type: 'RectGeometry', props: { width: 100, height: 100 } }
                ]
            }
        }

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
    })

    test('should handle mesh with only material', () => {
        const element = {
            type: 'Mesh',
            props: {
                children: [
                    { type: 'BasicMaterial', props: { color: '#blue' } }
                ]
            }
        }

        renderer.render(element)
        expect(renderer.scene.children).toHaveLength(1)
    })

    test('should handle mesh visibility', () => {
        const element = {
            type: 'Mesh',
            props: {
                visible: false,
                children: [
                    { type: 'RectGeometry', props: {} },
                    { type: 'BasicMaterial', props: {} }
                ]
            }
        }

        renderer.render(element)
        const mesh = renderer.scene.children[0]
        expect(mesh.visible).toBe(false)
    })

    test('should handle mesh scale', () => {
        const element = {
            type: 'Mesh',
            props: {
                scale: [2, 3],
                children: [
                    { type: 'RectGeometry', props: {} },
                    { type: 'BasicMaterial', props: {} }
                ]
            }
        }

        renderer.render(element)
        const mesh = renderer.scene.children[0]
        expect(mesh.scale.x).toBe(2)
        expect(mesh.scale.y).toBe(3)
    })

    test('should handle mesh rotation', () => {
        const element = {
            type: 'Mesh',
            props: {
                rotation: Math.PI / 4,
                children: [
                    { type: 'RectGeometry', props: {} },
                    { type: 'BasicMaterial', props: {} }
                ]
            }
        }

        renderer.render(element)
        const mesh = renderer.scene.children[0]
        expect(mesh.rotation).toBe(Math.PI / 4)
    })

    test('should handle group visibility', () => {
        const element = {
            type: 'Group',
            props: {
                visible: false,
                children: []
            }
        }

        renderer.render(element)
        const group = renderer.scene.children[0]
        expect(group.visible).toBe(false)
    })

    test('should handle group scale and rotation', () => {
        const element = {
            type: 'Group',
            props: {
                scale: [1.5, 2.5],
                rotation: Math.PI / 2,
                children: []
            }
        }

        renderer.render(element)
        const group = renderer.scene.children[0]
        expect(group.scale.x).toBe(1.5)
        expect(group.scale.y).toBe(2.5)
        expect(group.rotation).toBe(Math.PI / 2)
    })

    test('should handle all geometry types with custom props', () => {
        const rectGeom = renderer['createGeometryOrMaterial']({
            type: 'RectGeometry',
            props: { width: 200, height: 150, x: 10, y: 20 }
        })

        const circleGeom = renderer['createGeometryOrMaterial']({
            type: 'CircleGeometry',
            props: { radius: 75, x: 5, y: 15, startAngle: Math.PI / 4, endAngle: Math.PI * 1.5, counterclockwise: true }
        })

        const ellipseGeom = renderer['createGeometryOrMaterial']({
            type: 'EllipseGeometry',
            props: { radiusX: 60, radiusY: 40, x: 0, y: 0, rotation: Math.PI / 6, startAngle: 0, endAngle: Math.PI, counterclockwise: false }
        })

        const pathGeom = renderer['createGeometryOrMaterial']({
            type: 'PathGeometry',
            props: {}
        })

        expect(rectGeom).toBeDefined()
        expect(circleGeom).toBeDefined()
        expect(ellipseGeom).toBeDefined()
        expect(pathGeom).toBeDefined()
    })

    test('should handle all material types with custom props', () => {
        const basicMat = renderer['createGeometryOrMaterial']({
            type: 'BasicMaterial',
            props: { color: '#custom', opacity: 0.5, lineWidth: 2 }
        })

        const strokeMat = renderer['createGeometryOrMaterial']({
            type: 'StrokeMaterial',
            props: { color: '#stroke', lineWidth: 5, lineCap: 'round', lineJoin: 'bevel', lineDash: [5, 10], lineDashOffset: 3, opacity: 0.8 }
        })

        const gradMat = renderer['createGeometryOrMaterial']({
            type: 'GradientMaterial',
            props: { gradient: {} as CanvasGradient, opacity: 0.7 }
        })

        expect(basicMat).toBeDefined()
        expect(strokeMat).toBeDefined()
        expect(gradMat).toBeDefined()
    })

    test('should handle renderer start/stop', () => {
        expect(renderer['frameId']).not.toBeNull()
        renderer.stop()
        expect(renderer['frameId']).toBeNull()
        renderer.start()
        expect(renderer['frameId']).not.toBeNull()
    })

    test('should handle key generation with different props', () => {
        const key1 = renderer['generateKey']('Mesh', { position: [0, 0], visible: true })
        const key2 = renderer['generateKey']('Mesh', { position: [1, 1], visible: false })
        const key3 = renderer['generateKey']('Group', { position: [0, 0], visible: true })
        const key4 = renderer['generateKey'](() => {}, { test: 'prop' })

        expect(key1).toBeDefined()
        expect(key2).toBeDefined()
        expect(key3).toBeDefined()
        expect(key4).toBeDefined()
        expect(key1).not.toBe(key2)
        expect(key1).not.toBe(key3)
        expect(key1).not.toBe(key4)
    })

    test('should handle object caching between renders', () => {
        const element = {
            type: 'Mesh',
            props: {
                position: [50, 50],
                children: [
                    { type: 'RectGeometry', props: {} },
                    { type: 'BasicMaterial', props: {} }
                ]
            }
        }

        renderer.render(element)
        const firstRender = renderer.scene.children[0]

        renderer.render(element)
        const secondRender = renderer.scene.children[0]

        expect(firstRender).toBe(secondRender) // Should be same cached object
    })

    test('should clean up unused objects', () => {
        const element1 = {
            type: 'Mesh',
            props: {
                position: [10, 10],
                children: [
                    { type: 'RectGeometry', props: {} },
                    { type: 'BasicMaterial', props: {} }
                ]
            }
        }

        renderer.render(element1)
        expect(renderer.scene.children).toHaveLength(1)

        const element2 = {
            type: 'Mesh',
            props: {
                position: [20, 20],
                children: [
                    { type: 'CircleGeometry', props: {} },
                    { type: 'StrokeMaterial', props: {} }
                ]
            }
        }

        renderer.render(element2)
        expect(renderer.scene.children).toHaveLength(1) // Previous mesh should be cleaned up
    })

    test('should handle mesh ref callback', () => {
        let refMesh: any = null
        const element = {
            type: 'Mesh',
            props: {
                ref: (mesh: any) => { refMesh = mesh },
                children: [
                    { type: 'RectGeometry', props: {} },
                    { type: 'BasicMaterial', props: {} }
                ]
            }
        }

        renderer.render(element)
        expect(refMesh).not.toBeNull()
        expect(refMesh).toBe(renderer.scene.children[0])
    })
})