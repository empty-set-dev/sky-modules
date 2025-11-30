/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, vi } from 'vitest'

import Canvas from '../../core/CanvasRenderer'
import { RectGeometry, PathGeometry } from '../../geometries'
import { CanvasJSXRenderer } from '../../jsx/jsx'
import Scene from '../../core/Scene'

describe('Error Handling and Disposal', () => {
    describe('Canvas Error Handling', () => {
        test('should throw new Error when cannot get 2d context', () => {
            // Mock canvas that returns null for getContext
            const mockCanvas = {
                getContext: vi.fn().mockReturnValue(null),
                style: {},
                width: 0,
                height: 0,
            } as any

            expect(() => {
                new Canvas({
                    canvas: mockCanvas,
                    size: () => [100, 100],
                })
            }).toThrow('CanvasRenderer: get domElement 2d context')
        })

        test('should handle size function errors in constructor', () => {
            expect(() => {
                new Canvas({
                    size: () => {
                        throw new Error('Size calculation failed')
                    },
                })
            }).toThrow('Size calculation failed')
        })

        test('should handle invalid size values', () => {
            const invalidCanvas = new Canvas({
                size: () => [NaN, NaN],
            })

            expect(invalidCanvas.domElement.width).toBeNaN()
            expect(invalidCanvas.domElement.height).toBeNaN()
        })

        test('should handle negative size values', () => {
            const negativeCanvas = new Canvas({
                size: () => [-100, -200],
            })

            // Canvas dimensions should still be set (browser handles negatives)
            expect(negativeCanvas.domElement.width).toBe(-100)
            expect(negativeCanvas.domElement.height).toBe(-200)
        })

        test('should handle zero size values', () => {
            const zeroCanvas = new Canvas({
                size: () => [0, 0],
            })

            expect(zeroCanvas.domElement.width).toBe(0)
            expect(zeroCanvas.domElement.height).toBe(0)
        })

        test('should dispose canvas properly', () => {
            const canvas = new Canvas({ size: () => [100, 100] })

            // Should have dispose method
            expect(typeof canvas.dispose).toBe('function')

            // Should not throw when disposing
            expect(() => canvas.dispose()).not.toThrow()

            // Multiple dispose calls should not throw
            expect(() => canvas.dispose()).not.toThrow()
            expect(() => canvas.dispose()).not.toThrow()
        })

        test('should handle render with null scene', () => {
            const canvas = new Canvas({ size: () => [100, 100] })

            // Should throw with null scene
            expect(() => canvas.render(null as any)).toThrow()
        })

        test('should handle render with undefined scene', () => {
            const canvas = new Canvas({ size: () => [100, 100] })

            // Should throw with undefined scene
            expect(() => canvas.render(undefined as any)).toThrow()
        })
    })

    describe('CanvasJSXRenderer Error Handling', () => {
        test('should handle container appendChild errors in test environment', () => {
            const mockContainer = {
                appendChild: vi.fn().mockImplementation(() => {
                    throw new Error('appendChild failed')
                }),
            } as any

            // Should throw when appendChild fails (jsx.ts was changed to not catch this error)
            expect(() => {
                new CanvasJSXRenderer({ container: mockContainer })
            }).toThrow('appendChild failed')
        })

        test('should dispose renderer properly', () => {
            const renderer = new CanvasJSXRenderer()

            expect(typeof renderer.dispose).toBe('function')
            expect(() => renderer.dispose()).not.toThrow()

            // Multiple dispose calls should not throw
            expect(() => renderer.dispose()).not.toThrow()
        })

        test('should handle render with null element', () => {
            const renderer = new CanvasJSXRenderer()

            expect(() => renderer.render(null)).toThrow()
        })

        test('should handle render with undefined element', () => {
            const renderer = new CanvasJSXRenderer()

            expect(() => renderer.render(undefined)).toThrow()
        })

        test('should handle render with malformed element', () => {
            const renderer = new CanvasJSXRenderer()

            const malformedElement = {
                type: undefined,
                props: null,
            }

            expect(() => renderer.render(malformedElement)).toThrow()
        })

        test('should handle unknown element types gracefully', () => {
            const renderer = new CanvasJSXRenderer()

            const unknownElement = {
                type: 'UnknownElement',
                props: { children: [] },
            }

            expect(() => renderer.render(unknownElement)).not.toThrow()
        })

        test('should handle circular references in props', () => {
            const renderer = new CanvasJSXRenderer()

            const circularProps: any = { children: [] }
            circularProps.self = circularProps

            const element = {
                type: 'Mesh',
                props: circularProps,
            }

            // Should handle circular references gracefully (safe serialization)
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle function components that throw new Errors', () => {
            const renderer = new CanvasJSXRenderer()

            const ErrorComponent = (): void => {
                throw new Error('Component error')
            }

            const element = {
                type: ErrorComponent,
                props: { children: [] },
            }

            expect(() => renderer.render(element)).toThrow('Component error')
        })

        test('should handle very deep nesting without stack overflow', () => {
            const renderer = new CanvasJSXRenderer()

            // Create deeply nested structure
            let deepElement: any = {
                type: 'Mesh',
                props: {
                    children: [
                        { type: 'RectGeometry', props: {} },
                        { type: 'BasicMaterial', props: {} },
                    ],
                },
            }

            for (let i = 0; i < 1000; i++) {
                deepElement = {
                    type: 'Group',
                    props: { children: [deepElement] },
                }
            }

            // Should handle deep nesting without stack overflow
            expect(() => renderer.render(deepElement)).not.toThrow()
        })
    })

    describe('Geometry Error Handling', () => {
        test('PathGeometry should handle invalid command types', () => {
            const path = new PathGeometry()

            // Add invalid command directly to commands array
            path.commands.push({
                type: 'invalidCommand' as any,
                args: [1, 2, 3],
            })

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!

            // Should not throw when drawing invalid commands
            expect(() => path.draw(ctx, 1)).not.toThrow()
        })

        test('should handle drawing with null context', () => {
            const rect = new RectGeometry()

            expect(() => rect.draw(null as any, 1)).toThrow()
        })

        test('should handle drawing with undefined context', () => {
            const rect = new RectGeometry()

            expect(() => rect.draw(undefined as any, 1)).toThrow()
        })
    })

    describe('Scene Error Handling', () => {
        test('should handle invalid background values gracefully', () => {
            const scene = new Scene()

            // Should handle null background
            scene.setBackground(null as any)
            expect(scene.background).toBe(null)

            // Should handle undefined background
            scene.setBackground(undefined as any)
            expect(scene.background).toBe(undefined)
        })

        test('should handle rendering scene with invalid children', () => {
            const canvas = new Canvas({ size: () => [100, 100] })
            const scene = new Scene()

            // Add invalid child directly
            ;(scene.children as any).push(null)

            // Should throw when rendering with invalid children
            expect(() => canvas.render(scene)).toThrow()
        })
    })

    describe('Memory and Resource Management', () => {
        test('should properly clean up after multiple render cycles', () => {
            const renderer = new CanvasJSXRenderer()

            // Render multiple times with different content
            for (let i = 0; i < 100; i++) {
                const element = {
                    type: 'Mesh',
                    props: {
                        position: [i, i],
                        children: [
                            { type: 'RectGeometry', props: { width: i, height: i } },
                            {
                                type: 'BasicMaterial',
                                props: { color: `#${i.toString(16).padStart(6, '0')}` },
                            },
                        ],
                    },
                }

                renderer.render(element)
            }

            // Should not accumulate excessive objects
            expect(renderer['objectCache'].size).toBeLessThan(10)

            renderer.dispose()
        })

        test('should handle rapid start/stop cycles', () => {
            const renderer = new CanvasJSXRenderer()

            // Rapidly start and stop
            for (let i = 0; i < 10; i++) {
                renderer.start()
                renderer.stop()
            }

            expect(() => renderer.dispose()).not.toThrow()
        })

        test('should handle dispose during animation frame', () => {
            const renderer = new CanvasJSXRenderer()

            renderer.start()

            // Wait a tick to ensure animation frame is requested
            setTimeout(() => {
                expect(() => renderer.dispose()).not.toThrow()
            }, 0)
        })
    })
})
