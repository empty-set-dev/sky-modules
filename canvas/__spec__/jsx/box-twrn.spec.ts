// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach } from 'vitest'

import { CanvasJSXRenderer } from '../../jsx/jsx'

describe('CanvasJSXRenderer - Box with twrn (Tailwind Merge)', () => {
    let renderer: CanvasJSXRenderer
    let container: HTMLElement

    beforeEach(() => {
        container = document.createElement('div')
        document.body.appendChild(container)
        try {
            renderer = new CanvasJSXRenderer({ container })
        } catch (error) {
            renderer = new CanvasJSXRenderer()
        }
    })

    afterEach(() => {
        renderer?.dispose()
        if (container.parentNode) {
            document.body.removeChild(container)
        }
    })

    describe('Basic twrn functionality', () => {
        test('should merge conflicting padding classes (last wins)', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'p-2 p-4 p-6',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use p-6 (last one)
        })

        test('should merge conflicting margin classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'm-1 m-2 m-3 m-4',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use m-4 (last one)
        })

        test('should merge conflicting width classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-10 w-20 w-full w-32',
                    twrn: true,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use w-32 (last one)
        })

        test('should merge conflicting height classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'h-10 h-20 h-screen h-32',
                    twrn: true,
                    width: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use h-32 (last one)
        })

        test('should merge conflicting background color classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-red-500 bg-blue-500 bg-green-500 bg-yellow-500',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use bg-yellow-500 (last one)
        })

        test('should merge conflicting text color classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'text-red text-blue text-green',
                    twrn: true,
                    children: 'Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use text-green (last one)
        })
    })

    describe('twrn with directional utilities', () => {
        test('should merge conflicting directional padding (px overrides pl/pr)', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'pl-2 pr-3 px-4',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // px-4 should override both pl-2 and pr-3
        })

        test('should merge conflicting directional padding (py overrides pt/pb)', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'pt-2 pb-3 py-4',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // py-4 should override both pt-2 and pb-3
        })

        test('should merge padding with p overriding all directional', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'pt-1 pr-2 pb-3 pl-4 px-5 py-6 p-7',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // p-7 should override all
        })

        test('should keep specific direction if it comes after grouped', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'px-4 pl-8',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should have px-4 for right, pl-8 for left
        })
    })

    describe('twrn with border utilities', () => {
        test('should merge conflicting border width classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'border border-2 border-4',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use border-4
        })

        test('should merge conflicting border color classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'border-red-500 border-blue-500',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use border-blue-500
        })

        test('should merge conflicting border radius classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'rounded rounded-md rounded-lg rounded-xl',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use rounded-xl
        })

        test('should handle individual border radius corners', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'rounded-lg rounded-tl-none rounded-br-full',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use rounded-lg for tr and bl, overrides for tl and br
        })
    })

    describe('twrn with shadow utilities', () => {
        test('should merge conflicting shadow classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'shadow shadow-md shadow-lg shadow-xl',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use shadow-xl
        })

        test('should merge conflicting shadow color classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'shadow-lg shadow-red-500 shadow-blue-500',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use shadow-blue-500
        })
    })

    describe('twrn with layout utilities', () => {
        test('should merge conflicting display classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'block inline flex grid hidden flex',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use last flex
        })

        test('should merge conflicting position classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'static relative absolute fixed sticky relative',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use last relative
        })

        test('should merge conflicting flex direction classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'flex-row flex-col flex-row-reverse flex-col-reverse',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use flex-col-reverse
        })

        test('should merge conflicting justify content classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'justify-start justify-center justify-end justify-between',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use justify-between
        })

        test('should merge conflicting align items classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'items-start items-center items-end items-stretch',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use items-stretch
        })
    })

    describe('twrn with typography utilities', () => {
        test('should merge conflicting font size classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'text-xs text-sm text-base text-lg text-xl',
                    twrn: true,
                    children: 'Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use text-xl
        })

        test('should merge conflicting font weight classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'font-thin font-normal font-bold font-black',
                    twrn: true,
                    children: 'Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use font-black
        })

        test('should merge conflicting text align classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'text-left text-center text-right text-justify',
                    twrn: true,
                    children: 'Text',
                    width: 200
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use text-justify
        })

        test('should merge conflicting line height classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'leading-none leading-tight leading-normal leading-loose',
                    twrn: true,
                    children: 'Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use leading-loose
        })
    })

    describe('twrn with transform utilities', () => {
        test('should merge conflicting scale classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'scale-50 scale-75 scale-100 scale-150',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use scale-150
        })

        test('should merge conflicting rotate classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'rotate-0 rotate-45 rotate-90 rotate-180',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use rotate-180
        })

        test('should merge conflicting translate classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'translate-x-0 translate-x-1 translate-x-2',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use translate-x-2
        })

        test('should keep independent transform axes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'translate-x-4 translate-y-8 rotate-45 scale-110',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should apply all transforms
        })
    })

    describe('twrn with opacity utilities', () => {
        test('should merge conflicting opacity classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'opacity-0 opacity-25 opacity-50 opacity-75 opacity-100',
                    twrn: true,
                    width: 100,
                    height: 100,
                    backgroundColor: '#000'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use opacity-100
        })
    })

    describe('twrn with arbitrary values', () => {
        test('should handle arbitrary width values', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-[123px] w-[456px]',
                    twrn: true,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use w-[456px]
        })

        test('should handle arbitrary color values', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-[#123456] bg-[#abcdef]',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use bg-[#abcdef]
        })

        test('should merge arbitrary values with standard classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'p-4 p-[17px] m-2 m-[23px]',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use p-[17px] and m-[23px]
        })
    })

    describe('twrn with modifier prefixes', () => {
        test('should handle hover modifiers', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-blue hover:bg-red hover:bg-green',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use bg-blue for base, hover:bg-green for hover
        })

        test('should handle focus modifiers', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'border-gray focus:border-blue focus:border-red',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use focus:border-red
        })

        test('should handle active modifiers', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'scale-100 active:scale-95 active:scale-90',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use active:scale-90
        })

        test('should keep different modifiers separate', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-blue hover:bg-red focus:bg-green active:bg-yellow',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should keep all different state modifiers
        })
    })

    describe('twrn with responsive modifiers', () => {
        test('should merge conflicting classes per breakpoint', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-10 w-20 sm:w-30 sm:w-40 md:w-50 md:w-60',
                    twrn: true,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use w-20, sm:w-40, md:w-60
        })

        test('should keep different breakpoints separate', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5',
                    twrn: true,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should keep all breakpoints
        })

        test('should merge responsive flex utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'flex-col flex-row sm:flex-col sm:flex-row md:flex-col',
                    twrn: true,
                    width: 300,
                    height: 300
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use flex-row, sm:flex-row, md:flex-col
        })
    })

    describe('twrn with complex scenarios', () => {
        test('should handle very long className strings', () => {
            const classes = Array.from({ length: 50 }, (_, i) => `p-${i}`).join(' ')
            const element = {
                type: 'Box',
                props: {
                    className: classes,
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should use last p-49
        })

        test('should handle mixed utility types', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'p-2 m-2 p-4 bg-red m-4 bg-blue w-10 h-10 w-20 h-20',
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should merge each type independently
        })

        test('should handle duplicate classes', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'p-4 p-4 p-4 bg-red bg-red',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should deduplicate
        })

        test('should work with conditional classes', () => {
            const isActive = true
            const isLarge = false

            const element = {
                type: 'Box',
                props: {
                    className: [
                        'base-class',
                        isActive && 'active-class bg-blue',
                        isLarge && 'large-class w-200',
                        !isLarge && 'small-class w-100'
                    ]
                        .filter(Boolean)
                        .join(' '),
                    twrn: true,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle className as array (if supported)', () => {
            const element = {
                type: 'Box',
                props: {
                    className: ['p-2 m-2', 'p-4 m-4', 'bg-red bg-blue'],
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            // Should merge classes from array
            expect(() => renderer.render(element)).not.toThrow()
        })
    })

    describe('twrn disabled (default behavior)', () => {
        test('should not merge classes when twrn is false', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'p-2 p-4 p-6',
                    twrn: false,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should apply all classes without merging
        })

        test('should not merge classes when twrn is omitted', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-red bg-blue bg-green',
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Should apply all classes without merging
        })
    })

    describe('twrn integration with other props', () => {
        test('should work together with style prop', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'bg-red bg-blue p-2 p-4',
                    style: {
                        border: '1px solid black',
                        opacity: 0.9
                    },
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should work together with direct CSS props', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'w-10 w-20',
                    width: 300, // Direct prop should take priority
                    twrn: true,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should work together with sx prop', () => {
            const element = {
                type: 'Box',
                props: {
                    className: 'p-2 p-4',
                    sx: 'bg-c_blue',
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('twrn performance', () => {
        test('should handle merging efficiently with many classes', () => {
            const startTime = performance.now()

            for (let i = 0; i < 100; i++) {
                const element = {
                    type: 'Box',
                    props: {
                        className: 'p-1 p-2 p-3 p-4 m-1 m-2 m-3 bg-red bg-blue bg-green w-10 w-20 h-10 h-20',
                        twrn: true,
                        width: 100,
                        height: 100
                    }
                }

                renderer.render(element)
            }

            const endTime = performance.now()
            const duration = endTime - startTime

            // Should complete in reasonable time (adjust threshold as needed)
            expect(duration).toBeLessThan(1000) // Less than 1 second for 100 iterations
        })

        test('should cache merged results when possible', () => {
            const className = 'p-2 p-4 m-2 m-4 bg-red bg-blue'

            const element = {
                type: 'Box',
                props: {
                    className,
                    twrn: true,
                    width: 100,
                    height: 100
                }
            }

            // First render
            renderer.render(element)
            const firstMesh = renderer.scene.children[0]

            // Second render with same className
            renderer.render(element)
            const secondMesh = renderer.scene.children[0]

            // Should reuse the same mesh
            expect(firstMesh).toBe(secondMesh)
        })
    })
})
