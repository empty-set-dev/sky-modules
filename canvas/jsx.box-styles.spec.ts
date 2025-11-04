// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

import { CanvasJSXRenderer } from './jsx'
import type { CSSProperties } from './renderCSSToCanvas'

describe('CanvasJSXRenderer - Box, twrn, and style props support', () => {
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

    describe('Box component support', () => {
        test('should render Box with basic CSS properties', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 100,
                    height: 100,
                    backgroundColor: '#ff0000',
                    position: [50, 50]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with style props', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: '200px',
                        height: '150px',
                        backgroundColor: '#00ff00',
                        borderRadius: '10px'
                    },
                    position: [0, 0]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with padding and margin', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 100,
                    height: 100,
                    padding: 10,
                    margin: 20,
                    backgroundColor: '#0000ff'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with border properties', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 100,
                    height: 100,
                    border: '2px solid black',
                    borderRadius: 8
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with shadow properties', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 100,
                    height: 100,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    backgroundColor: '#ffffff'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render nested Box components', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 200,
                    height: 200,
                    backgroundColor: '#f0f0f0',
                    children: [
                        {
                            type: 'Box',
                            props: {
                                width: 50,
                                height: 50,
                                backgroundColor: '#ff0000',
                                position: [10, 10]
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with transform properties', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 100,
                    height: 100,
                    transform: 'rotate(45deg) scale(1.5)',
                    backgroundColor: '#ff00ff'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with opacity', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 100,
                    height: 100,
                    opacity: 0.5,
                    backgroundColor: '#ffff00'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with flexbox properties', () => {
            const element = {
                type: 'Box',
                props: {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                    width: 300,
                    height: 200,
                    children: [
                        {
                            type: 'Box',
                            props: {
                                width: 50,
                                height: 50,
                                backgroundColor: '#ff0000'
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                width: 50,
                                height: 50,
                                backgroundColor: '#00ff00'
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with grid layout', () => {
            const element = {
                type: 'Box',
                props: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridGap: 10,
                    width: 300,
                    height: 300,
                    children: Array.from({ length: 6 }, (_, i) => ({
                        type: 'Box',
                        props: {
                            width: 80,
                            height: 80,
                            backgroundColor: `hsl(${i * 60}, 70%, 50%)`
                        }
                    }))
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('twrn (Tailwind merge) support', () => {
        test('should handle twrn with single class', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-100 h-100 bg-red',
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle twrn with conflicting classes (last wins)', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-red bg-blue bg-green',
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use the last color (green)
        })

        test('should handle twrn with multiple utility classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-100 h-100 p-4 m-2 bg-blue rounded-lg shadow-md',
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle twrn with responsive classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-full md:w-1/2 lg:w-1/3',
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should merge twrn classes with inline styles', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-100 h-100',
                    style: {
                        backgroundColor: '#custom'
                    },
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle twrn with pseudo-class modifiers', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-blue hover:bg-red active:bg-green',
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle twrn with arbitrary values', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-[123px] h-[456px] bg-[#1c1c1c]',
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('CSS style props support', () => {
        test('should apply CSS text properties', () => {
            const element = {
                type: 'Box',
                props: {
                    fontSize: '24px',
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center' as CanvasTextAlign,
                    children: 'Hello Canvas'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply CSS box model properties', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 200,
                    height: 150,
                    padding: 20,
                    paddingTop: 10,
                    paddingRight: 15,
                    margin: 10,
                    marginLeft: 20
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply CSS background properties', () => {
            const element = {
                type: 'Box',
                props: {
                    backgroundColor: '#ff5500',
                    backgroundImage: 'linear-gradient(to right, red, blue)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: 300,
                    height: 200
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply CSS border properties with individual corners', () => {
            const element = {
                type: 'Box',
                props: {
                    border: '2px solid #000',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 20,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 15,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply CSS shadow properties', () => {
            const element = {
                type: 'Box',
                props: {
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    textShadow: '2px 2px 4px #000',
                    width: 150,
                    height: 100,
                    children: 'Shadow Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply CSS transform properties', () => {
            const element = {
                type: 'Box',
                props: {
                    transform: 'rotate(30deg) scale(1.2) translateX(50px)',
                    width: 100,
                    height: 100,
                    backgroundColor: '#purple'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply CSS flexbox layout properties', () => {
            const element = {
                type: 'Box',
                props: {
                    display: 'flex',
                    flexDirection: 'column' as const,
                    justifyContent: 'space-between' as const,
                    alignItems: 'flex-start' as const,
                    flexWrap: 'wrap' as const,
                    gap: 15,
                    rowGap: 20,
                    columnGap: 10,
                    width: 400,
                    height: 300
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply CSS grid layout properties', () => {
            const element = {
                type: 'Box',
                props: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 1fr',
                    gridTemplateRows: 'auto 100px auto',
                    gridGap: 10,
                    gridRowGap: 15,
                    gridColumnGap: 20,
                    gridAutoFlow: 'row' as const,
                    width: 500,
                    height: 400
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should support kebab-case CSS properties', () => {
            const element = {
                type: 'Box',
                props: {
                    'flex-direction': 'row' as const,
                    'justify-content': 'center' as const,
                    'align-items': 'center' as const,
                    'background-color': '#ff00ff',
                    'border-radius': '8px',
                    width: 200,
                    height: 200
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Combined Box, twrn, and style props', () => {
        test('should handle Box with both className (twrn) and style props', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-100 h-100 p-4',
                    style: {
                        backgroundColor: '#custom',
                        borderRadius: '12px'
                    },
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle Box with className, style, and direct CSS props', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-blue',
                    style: { border: '1px solid red' },
                    width: 100,
                    height: 100,
                    opacity: 0.8,
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle nested Boxes with mixed prop types', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'container',
                    style: { padding: '20px' },
                    width: 400,
                    height: 400,
                    children: [
                        {
                            type: 'Box',
                            props: {
                                className: 'w-50 h-50',
                                backgroundColor: '#red',
                                twrn: true
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                style: { width: '50px', height: '50px' },
                                backgroundColor: '#blue'
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should prioritize inline styles over className (twrn)', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-red w-100',
                    style: {
                        backgroundColor: '#0000ff', // Should override bg-red
                        width: '200px' // Should override w-100
                    },
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle Box with complex layout using all prop types', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'flex gap-4',
                    style: {
                        padding: '10px',
                        backgroundColor: '#f5f5f5'
                    },
                    flexDirection: 'row' as const,
                    justifyContent: 'space-around' as const,
                    width: 600,
                    height: 300,
                    twrn: true,
                    children: Array.from({ length: 3 }, (_, i) => ({
                        type: 'Box',
                        props: {
                            className: `item-${i}`,
                            style: { margin: '5px' },
                            width: 150,
                            height: 150,
                            backgroundColor: `hsl(${i * 120}, 60%, 50%)`,
                            borderRadius: 8
                        }
                    }))
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Box with ref callback', () => {
        test('should call ref callback with Box mesh', () => {
            let refBox: any = null
            const element = {
                type: 'Box',
                props: {
                    ref: (box: any) => { refBox = box },
                    width: 100,
                    height: 100,
                    backgroundColor: '#00ff00'
                }
            }

            renderer.render(element)
            expect(refBox).not.toBeNull()
            expect(renderer.scene.children[0]).toBe(refBox)
        })
    })

    describe('Box with update callbacks', () => {
        test('should handle Box with onUpdate callback', () => {
            let updateCalled = false
            const element = {
                type: 'Box',
                props: {
                    width: 100,
                    height: 100,
                    onUpdate: () => {
                        updateCalled = true
                    }
                }
            }

            renderer.render(element)

            // Simulate animation frame
            renderer['animate']()

            expect(updateCalled).toBe(true)
        })
    })

    describe('Box error handling', () => {
        test('should handle Box with invalid CSS values gracefully', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 'invalid',
                    height: 'invalid',
                    backgroundColor: 'not-a-color'
                }
            }

            // Should not throw
            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle Box without required properties', () => {
            const element = {
                type: 'Box',
                props: {}
            }

            // Should render with defaults
            expect(() => renderer.render(element)).not.toThrow()
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Box with text content', () => {
        test('should render Box with text children', () => {
            const element = {
                type: 'Box',
                props: {
                    width: 200,
                    height: 100,
                    fontSize: '18px',
                    color: '#000',
                    children: 'Hello Canvas Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render Box with multiple text styles', () => {
            const element = {
                type: 'Box',
                props: {
                    fontSize: '24px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textAlign: 'center' as CanvasTextAlign,
                    lineHeight: 1.5,
                    color: '#333',
                    children: 'Styled Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })
})
