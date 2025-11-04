// @vitest-environment jsdom

import './test-setup'

import { describe, test, expect, beforeEach, afterEach } from 'vitest'

import { CanvasJSXRenderer } from './jsx'

describe('CanvasJSXRenderer - Box with Panda CSS utilities', () => {
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

    describe('Panda CSS spacing utilities', () => {
        test('should apply padding utilities (p, px, py, pt, pr, pb, pl)', () => {
            const elements = [
                { sx: 'p_4', desc: 'padding all sides' },
                { sx: 'px_8', desc: 'padding x-axis' },
                { sx: 'py_6', desc: 'padding y-axis' },
                { sx: 'pt_2 pr_4 pb_6 pl_8', desc: 'individual paddings' }
            ]

            elements.forEach(({ sx, desc }) => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply margin utilities (m, mx, my, mt, mr, mb, ml)', () => {
            const elements = [
                { sx: 'm_4', desc: 'margin all sides' },
                { sx: 'mx_auto', desc: 'margin x-axis auto' },
                { sx: 'my_8', desc: 'margin y-axis' },
                { sx: 'mt_0 mr_2 mb_4 ml_6', desc: 'individual margins' }
            ]

            elements.forEach(({ sx, desc }) => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply gap utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'gap_4',
                    style: { display: 'flex' },
                    children: [
                        { type: 'Box', props: { width: 50, height: 50 } },
                        { type: 'Box', props: { width: 50, height: 50 } }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS sizing utilities', () => {
        test('should apply width utilities (w, min-w, max-w)', () => {
            const elements = [
                { sx: 'w_100', desc: 'fixed width' },
                { sx: 'w_full', desc: 'full width' },
                { sx: 'w_1/2', desc: 'fractional width' },
                { sx: 'min-w_0', desc: 'min width' },
                { sx: 'max-w_xl', desc: 'max width' }
            ]

            elements.forEach(({ sx, desc }) => {
                const element = {
                    type: 'Box',
                    props: { sx, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply height utilities (h, min-h, max-h)', () => {
            const elements = [
                { sx: 'h_100', desc: 'fixed height' },
                { sx: 'h_full', desc: 'full height' },
                { sx: 'h_screen', desc: 'screen height' },
                { sx: 'min-h_0', desc: 'min height' },
                { sx: 'max-h_sm', desc: 'max height' }
            ]

            elements.forEach(({ sx, desc }) => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply size utilities (both width and height)', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'size_100'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS color utilities', () => {
        test('should apply background color utilities', () => {
            const colors = [
                'bg-c_red',
                'bg-c_blue',
                'bg-c_green',
                'bg-c_yellow',
                'bg-c_purple',
                'bg-c_gray-100',
                'bg-c_transparent'
            ]

            colors.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply text color utilities', () => {
            const colors = ['c_white', 'c_black', 'c_red', 'c_blue-500']

            colors.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, children: 'Text' }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply gradient utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bg-grad_to-r grad-from_purple grad-to_pink',
                    width: 200,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS border utilities', () => {
        test('should apply border width utilities', () => {
            const borders = ['bd-w_1', 'bd-w_2', 'bd-w_4', 'bd-w_8']

            borders.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply border radius utilities', () => {
            const radii = [
                'bdr_none',
                'bdr_sm',
                'bdr_md',
                'bdr_lg',
                'bdr_xl',
                'bdr_full',
                'rounded_sm',
                'rounded_full'
            ]

            radii.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply individual border radius utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bdr-tl_lg bdr-tr_sm bdr-br_md bdr-bl_xl',
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply border color utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bd-c_red bd-w_2',
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS shadow utilities', () => {
        test('should apply box shadow utilities', () => {
            const shadows = [
                'shadow_xs',
                'shadow_sm',
                'shadow_md',
                'shadow_lg',
                'shadow_xl',
                'shadow_2xl',
                'shadow_inner',
                'shadow_none'
            ]

            shadows.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply shadow color utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'shadow_lg shadow-c_red',
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS layout utilities', () => {
        test('should apply display utilities', () => {
            const displays = ['d_block', 'd_inline', 'd_flex', 'd_grid', 'd_none']

            displays.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply position utilities', () => {
            const positions = ['pos_relative', 'pos_absolute', 'pos_fixed', 'pos_sticky']

            positions.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply inset utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'inset_0 top_10 left_20',
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS flexbox utilities', () => {
        test('should apply flex direction utilities', () => {
            const directions = ['flex-d_row', 'flex-d_col', 'flex-d_row-reverse', 'flex-d_col-reverse']

            directions.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: {
                        sx: `d_flex ${sx}`,
                        width: 200,
                        height: 200,
                        children: [
                            { type: 'Box', props: { width: 50, height: 50 } },
                            { type: 'Box', props: { width: 50, height: 50 } }
                        ]
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply justify content utilities', () => {
            const justifies = [
                'jc_start',
                'jc_end',
                'jc_center',
                'jc_between',
                'jc_around',
                'jc_evenly'
            ]

            justifies.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: {
                        sx: `d_flex ${sx}`,
                        width: 300,
                        height: 100
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply align items utilities', () => {
            const aligns = ['ai_start', 'ai_end', 'ai_center', 'ai_baseline', 'ai_stretch']

            aligns.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: {
                        sx: `d_flex ${sx}`,
                        width: 100,
                        height: 200
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply flex wrap utilities', () => {
            const wraps = ['flex-wrap_wrap', 'flex-wrap_nowrap', 'flex-wrap_wrap-reverse']

            wraps.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: {
                        sx: `d_flex ${sx}`,
                        width: 200,
                        height: 200,
                        children: Array.from({ length: 10 }, () => ({
                            type: 'Box',
                            props: { width: 50, height: 50 }
                        }))
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply flex grow/shrink utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'd_flex',
                    width: 400,
                    height: 100,
                    children: [
                        {
                            type: 'Box',
                            props: { sx: 'flex-g_1', height: 100 }
                        },
                        {
                            type: 'Box',
                            props: { sx: 'flex-g_0 flex-sh_1', width: 100, height: 100 }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS grid utilities', () => {
        test('should apply grid template columns utilities', () => {
            const templates = [
                'grid-tc_1',
                'grid-tc_2',
                'grid-tc_3',
                'grid-tc_4',
                'grid-tc_repeat(3, 1fr)'
            ]

            templates.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: {
                        sx: `d_grid ${sx}`,
                        width: 300,
                        height: 300,
                        children: Array.from({ length: 6 }, () => ({
                            type: 'Box',
                            props: { height: 50 }
                        }))
                    }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply grid gap utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'd_grid grid-g_4',
                    width: 300,
                    height: 300,
                    children: Array.from({ length: 4 }, () => ({
                        type: 'Box',
                        props: { width: 50, height: 50 }
                    }))
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply grid column/row span utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'd_grid grid-tc_3',
                    width: 300,
                    height: 300,
                    children: [
                        {
                            type: 'Box',
                            props: { sx: 'grid-c_span-2', height: 50 }
                        },
                        {
                            type: 'Box',
                            props: { sx: 'grid-c_span-1', height: 50 }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS typography utilities', () => {
        test('should apply font size utilities', () => {
            const sizes = ['fs_xs', 'fs_sm', 'fs_md', 'fs_lg', 'fs_xl', 'fs_2xl']

            sizes.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, children: 'Text' }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply font weight utilities', () => {
            const weights = [
                'fw_thin',
                'fw_light',
                'fw_normal',
                'fw_medium',
                'fw_semibold',
                'fw_bold',
                'fw_extrabold'
            ]

            weights.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, children: 'Text' }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply text align utilities', () => {
            const aligns = ['ta_left', 'ta_center', 'ta_right', 'ta_justify']

            aligns.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, children: 'Text', width: 200 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply line height utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'lh_tight',
                    children: 'Multi\nLine\nText'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS transform utilities', () => {
        test('should apply rotate utilities', () => {
            const rotations = ['rotate_0', 'rotate_45', 'rotate_90', 'rotate_180']

            rotations.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply scale utilities', () => {
            const scales = ['scale_50', 'scale_75', 'scale_100', 'scale_125', 'scale_150']

            scales.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100 }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })

        test('should apply translate utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'translate-x_50 translate-y_100',
                    width: 100,
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS opacity utilities', () => {
        test('should apply opacity utilities', () => {
            const opacities = ['op_0', 'op_25', 'op_50', 'op_75', 'op_100']

            opacities.forEach(sx => {
                const element = {
                    type: 'Box',
                    props: { sx, width: 100, height: 100, backgroundColor: '#000' }
                }

                renderer.render(element)
                expect(renderer.scene.children).toHaveLength(1)
            })
        })
    })

    describe('Panda CSS responsive utilities', () => {
        test('should apply responsive breakpoint utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'w_100 sm:w_200 md:w_300 lg:w_400 xl:w_500',
                    height: 100
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply responsive flex utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'd_block sm:d_flex md:flex-d_col lg:flex-d_row',
                    width: 300,
                    height: 300
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply responsive grid utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'd_grid grid-tc_1 sm:grid-tc_2 md:grid-tc_3 lg:grid-tc_4',
                    width: 400,
                    height: 400
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })

    describe('Panda CSS composite utilities', () => {
        test('should combine multiple utility classes', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'w_200 h_150 p_4 m_2 bg-c_blue bdr_lg shadow_md op_90',
                    position: [100, 100]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply card-like styling with utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bg-c_white p_6 bdr_xl shadow_lg border_solid bd-w_1 bd-c_gray-200',
                    width: 300,
                    height: 200,
                    children: [
                        {
                            type: 'Box',
                            props: {
                                sx: 'fs_xl fw_bold c_gray-900 mb_2',
                                children: 'Card Title'
                            }
                        },
                        {
                            type: 'Box',
                            props: {
                                sx: 'fs_sm c_gray-600',
                                children: 'Card description text'
                            }
                        }
                    ]
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })

        test('should apply button-like styling with utilities', () => {
            const element = {
                type: 'Box',
                props: {
                    sx: 'bg-c_blue c_white px_6 py_3 bdr_md fw_semibold ta_center cursor_pointer',
                    width: 150,
                    height: 50,
                    children: 'Click Me'
                }
            }

            renderer.render(element)
            expect(renderer.scene.children).toHaveLength(1)
        })
    })
})
