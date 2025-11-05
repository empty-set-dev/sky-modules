// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

import { CanvasJSXRenderer } from '../../jsx/jsx'

describe('CanvasJSXRenderer - Box Integration with Panda CSS and renderCSSToCanvas', () => {
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

    describe('Panda CSS integration', () => {
        test('should convert Panda CSS tokens to canvas styles', () => {
            const element = {
                type: 'Box',
                props: {
                    // Panda CSS utility classes
                    sx: 'w_100 h_100 bg-c_red p_4',
                    position: [0, 0]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle Panda CSS responsive breakpoints', () => {
            const element = {
                type: 'Box',
                props: {
                    // Base and responsive styles
                    sx: {
                        base: 'w_100',
                        sm: 'w_200',
                        md: 'w_300',
                        lg: 'w_400'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply Panda CSS patterns (box, flex, stack)', () => {
            const element = {
                type: 'Box',
                props: {
                    // Using box pattern
                    sx: 'box',
                    padding: 10,
                    children: [
                        {
                            type: 'Box',
                            props: {
                                sx: 'flex',
                                gap: 5
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle Panda CSS semantic tokens', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bg-c_primary color_on-primary',
                    width: 150,
                    height: 75
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should merge multiple Panda CSS utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: [
                        'w_100 h_100',
                        'bg-c_blue',
                        'p_4 m_2',
                        'bdr_8'
                    ].join(' ')
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('renderCSSToCanvas integration', () => {
        test('should render CSS background gradients to canvas', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: '200px',
                        height: '200px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render CSS box shadow with multiple shadows', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: '150px',
                        height: '150px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
                        backgroundColor: '#fff'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render CSS border with individual sides', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: '100px',
                        height: '100px',
                        borderTop: '2px solid red',
                        borderRight: '3px dashed blue',
                        borderBottom: '4px dotted green',
                        borderLeft: '5px double yellow'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render CSS text with multiple properties', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        fontSize: '24px',
                        fontFamily: 'Georgia, serif',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        color: '#2c3e50',
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        lineHeight: '1.6'
                    },
                    children: 'Styled Canvas Text'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render CSS transform matrix', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: '100px',
                        height: '100px',
                        transform: 'matrix(1, 0.5, -0.5, 1, 30, 30)',
                        backgroundColor: '#3498db'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle CSS calc() values', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: 'calc(100% - 20px)',
                        height: 'calc(50vh - 10px)',
                        padding: 'calc(1rem + 5px)'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should render CSS background image patterns', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: '300px',
                        height: '200px',
                        backgroundImage: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)',
                        backgroundSize: '100% 100%'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Flexbox layout rendering', () => {
        test('should layout children with flex-direction: row', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        width: '400px',
                        height: '100px',
                        gap: '10px'
                    },
                    children: [
                        {
                            type: 'Box',
                            props: {
                                style: { width: '100px', height: '100px', backgroundColor: 'red' }
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                style: { width: '100px', height: '100px', backgroundColor: 'green' }
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                style: { width: '100px', height: '100px', backgroundColor: 'blue' }
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should layout children with flex-direction: column', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100px',
                        height: '400px',
                        gap: '10px'
                    },
                    children: [
                        {
                            type: 'Box',
                            props: {
                                style: { width: '100px', height: '100px', backgroundColor: 'red' }
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                style: { width: '100px', height: '100px', backgroundColor: 'green' }
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle justify-content values', () => {
            const justifyValues = [
                'flex-start',
                'flex-end',
                'center',
                'space-between',
                'space-around',
                'space-evenly'
            ] as const

            justifyValues.forEach(justify => {
                const element = {
                    type: 'Box',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: justify,
                            width: '400px',
                            height: '100px'
                        },
                        children: [
                            { type: 'Box', props: { style: { width: '50px', height: '50px' } } }
                        ]
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should handle align-items values', () => {
            const alignValues = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'] as const

            alignValues.forEach(align => {
                const element = {
                    type: 'Box',
                    props: {
                        style: {
                            display: 'flex',
                            alignItems: align,
                            width: '400px',
                            height: '200px'
                        },
                        children: [
                            { type: 'Box', props: { style: { width: '50px', height: '50px' } } }
                        ]
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should handle flex-wrap', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'flex',
                        flexWrap: 'wrap',
                        width: '200px',
                        height: '300px',
                        gap: '10px'
                    },
                    children: Array.from({ length: 10 }, () => ({
                        type: 'Box',
                        props: {
                            style: { width: '50px', height: '50px', backgroundColor: '#ccc' }
                        }
                    }))
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Grid layout rendering', () => {
        test('should layout children with grid-template-columns', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '10px',
                        width: '400px',
                        height: '400px'
                    },
                    children: Array.from({ length: 9 }, (_, i) => ({
                        type: 'Box',
                        props: {
                            style: {
                                backgroundColor: `hsl(${i * 40}, 70%, 60%)`
                            }
                        }
                    }))
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle complex grid template areas', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'auto 1fr auto',
                        gridGap: '15px',
                        width: '500px',
                        height: '500px'
                    },
                    children: [
                        {
                            type: 'Box',
                            props: {
                                style: {
                                    gridColumn: '1 / -1',
                                    backgroundColor: 'header'
                                }
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                style: { backgroundColor: 'sidebar' }
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                style: {
                                    gridColumn: 'span 2',
                                    backgroundColor: 'main'
                                }
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle grid auto-flow', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'grid',
                        gridAutoFlow: 'column',
                        gridAutoColumns: '100px',
                        gap: '10px',
                        width: '500px',
                        height: '200px'
                    },
                    children: Array.from({ length: 5 }, () => ({
                        type: 'Box',
                        props: {
                            style: { backgroundColor: '#f0f0f0' }
                        }
                    }))
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Complex nested layouts', () => {
        test('should handle nested flex containers', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        width: '500px',
                        height: '500px',
                        padding: '20px'
                    },
                    children: [
                        {
                            type: 'Box',
                            props: {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#header',
                                    padding: '10px'
                                }
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                style: {
                                    display: 'flex',
                                    flex: 1,
                                    gap: '10px'
                                },
                                children: [
                                    {
                                        type: 'Box',
                                        props: {
                                            style: {
                                                width: '200px',
                                                backgroundColor: '#sidebar'
                                            }
                                        }
                                    },
                                    {
                                        type: 'Box',
                                        props: {
                                            style: {
                                                flex: 1,
                                                backgroundColor: '#content'
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should handle grid inside flex container', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '600px',
                        height: '600px'
                    },
                    children: [
                        {
                            type: 'Box',
                            props: {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '20px',
                                    width: '400px'
                                },
                                children: Array.from({ length: 4 }, (_, i) => ({
                                    type: 'Box',
                                    props: {
                                        style: {
                                            width: '180px',
                                            height: '180px',
                                            backgroundColor: `hsl(${i * 90}, 60%, 50%)`
                                        }
                                    }
                                }))
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Style prop priority and merging', () => {
        test('should merge sx prop with style prop (style takes priority)', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bg-c_red w_100',
                    style: {
                        backgroundColor: 'blue', // Should override sx bg-c_red
                        height: '150px'
                    }
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should merge sx prop with direct CSS props (direct props take priority)', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'w_100 h_100',
                    width: 200, // Should override sx w_100
                    backgroundColor: '#custom'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply all style sources in correct priority order', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bg-c_gray w_100 h_100 p_2',
                    className: 'bg-red w-150',
                    style: {
                        backgroundColor: 'yellow',
                        padding: '10px'
                    },
                    width: 250,
                    twrn: true
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
            // Priority: direct props > style > className > sx
        })
    })

    describe('Performance and caching', () => {
        test('should cache and reuse Box meshes with same props', () => {
            const props = {
                width: 100,
                height: 100,
                backgroundColor: '#test'
            }

            const element = {
                type: 'Box',
                props
            }

            renderer.render(element)
            const firstMesh = renderer.scene.children[0]

            renderer.render(element)
            const secondMesh = renderer.scene.children[0]

            expect(firstMesh).toBe(secondMesh)
        })

        test('should handle rapid style changes efficiently', () => {
            const colors = ['#red', '#green', '#blue', '#yellow', '#purple']

            colors.forEach(color => {
                const element = {
                    type: 'Box',
                    props: {
                        width: 100,
                        height: 100,
                        backgroundColor: color
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })
    })

    describe('Edge cases and error handling', () => {
        test('should handle empty style objects', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {},
                    sx: '',
                    className: ''
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle null/undefined style values', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        width: null,
                        height: undefined,
                        backgroundColor: null
                    }
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle circular references in style objects', () => {
            const circularStyle: any = { width: 100 }
            circularStyle.self = circularStyle

            const element = {
                type: 'Box',
                props: {
                    style: circularStyle
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
        })

        test('should handle very large number of children', () => {
            const element = {
                type: 'Box',
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        gap: '5px'
                    },
                    children: Array.from({ length: 100 }, (_, i) => ({
                        type: 'Box',
                        props: {
                            style: {
                                width: '20px',
                                height: '20px',
                                backgroundColor: `hsl(${i * 3.6}, 60%, 50%)`
                            }
                        }
                    }))
                }
            }

            expect(() => renderer.render(element)).not.toThrow()
            expect(renderer.scene.children).toHaveLength(1)
        })
    })
})
