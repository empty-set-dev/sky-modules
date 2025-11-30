/**
 * Layout Engine Tests
 * Comprehensive tests for layout computation, coordinates, and sizing
 */

import { describe, expect, it } from 'vitest'

import { computeLayout, type LayoutBox } from './Layout.Engine'

describe('Layout Engine', () => {
    describe('Block Layout - Auto Width', () => {
        it('should auto-fill parent width when width is not specified', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 100,
                            // No width specified - should auto-fill
                        },
                    },
                ],
            }

            const result = computeLayout(layout, { width: 1000, height: 1000 })

            // Child should fill parent width minus padding (800 - 40 = 760)
            expect(result.children?.[0]?.size?.[0]).toBe(760)
            expect(result.children?.[0]?.size?.[1]).toBe(100)
        })

        it('should respect explicit width when specified', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            width: 300,
                            height: 100,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Child should use explicit width
            expect(result.children?.[0]?.size?.[0]).toBe(300)
            expect(result.children?.[0]?.size?.[1]).toBe(100)
        })

        it('should position children vertically with correct coordinates', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'block',
                },
                children: [
                    {
                        id: 'child1',
                        styles: {
                            height: 100,
                        },
                    },
                    {
                        id: 'child2',
                        styles: {
                            height: 150,
                        },
                    },
                    {
                        id: 'child3',
                        styles: {
                            height: 80,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // First child at padding top
            expect(result.children?.[0]?.position).toEqual([20, 20])

            // Second child after first (20 + 100 = 120)
            expect(result.children?.[1]?.position).toEqual([20, 120])

            // Third child after second (120 + 150 = 270)
            expect(result.children?.[2]?.position).toEqual([20, 270])
        })

        it('should account for margins in positioning', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'block',
                },
                children: [
                    {
                        id: 'child1',
                        styles: {
                            height: 100,
                            marginTop: 10,
                            marginBottom: 30,
                        },
                    },
                    {
                        id: 'child2',
                        styles: {
                            height: 150,
                            marginTop: 10,
                            marginLeft: 15,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // First child at padding + marginTop
            expect(result.children?.[0]?.position).toEqual([20, 30]) // 20(padding) + 10(marginTop)

            // Second child: 30(y of child1) + 100(height) + 30(marginBottom) + 10(marginTop of child2)
            expect(result.children?.[1]?.position).toEqual([35, 170]) // 20(padding) + 15(marginLeft), 170(y)
        })

        it('should reduce child width by margins', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 100,
                            marginLeft: 30,
                            marginRight: 50,
                            // No width - should auto-fill minus margins
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Available width: 800 - 40(padding) = 760
            // Minus margins: 760 - 30 - 50 = 680
            expect(result.children?.[0]?.size?.[0]).toBe(680)
        })
    })

    describe('Flex Layout - Row', () => {
        it('should position children horizontally', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 200,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                },
                children: [
                    {
                        id: 'child1',
                        styles: {
                            width: 100,
                            height: 50,
                        },
                    },
                    {
                        id: 'child2',
                        styles: {
                            width: 150,
                            height: 60,
                        },
                    },
                    {
                        id: 'child3',
                        styles: {
                            width: 80,
                            height: 40,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // First child at padding
            expect(result.children?.[0]?.position).toEqual([20, 20])

            // Second child: 20 + 100 + 10(gap) = 130
            expect(result.children?.[1]?.position).toEqual([130, 20])

            // Third child: 130 + 150 + 10(gap) = 290
            expect(result.children?.[2]?.position).toEqual([290, 20])
        })

        it('should NOT auto-fill width in row direction', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 200,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'row',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 50,
                            // No width - should use fallback (100)
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // In flex row, width is not auto-filled, uses fallback
            expect(result.children?.[0]?.size?.[0]).toBe(100)
        })

        it('should apply gap between items but not after last', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 200,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 15,
                },
                children: [
                    {
                        id: 'child1',
                        styles: { width: 100, height: 50 },
                    },
                    {
                        id: 'child2',
                        styles: { width: 100, height: 50 },
                    },
                ],
            }

            const result = computeLayout(layout)

            // First at padding
            expect(result.children?.[0]?.position?.[0]).toBe(20)
            // Second at first + width + gap
            expect(result.children?.[1]?.position?.[0]).toBe(135) // 20 + 100 + 15
        })
    })

    describe('Flex Layout - Column', () => {
        it('should auto-fill width in column direction', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                },
                children: [
                    {
                        id: 'child1',
                        styles: {
                            height: 100,
                            // No width - should auto-fill in flex column
                        },
                    },
                    {
                        id: 'child2',
                        styles: {
                            height: 150,
                            // No width - should auto-fill
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Both children should fill parent width minus padding
            expect(result.children?.[0]?.size?.[0]).toBe(760) // 800 - 40
            expect(result.children?.[1]?.size?.[0]).toBe(760)
        })

        it('should position children vertically with gap', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 15,
                },
                children: [
                    {
                        id: 'child1',
                        styles: { height: 100 },
                    },
                    {
                        id: 'child2',
                        styles: { height: 150 },
                    },
                    {
                        id: 'child3',
                        styles: { height: 80 },
                    },
                ],
            }

            const result = computeLayout(layout)

            // First at padding
            expect(result.children?.[0]?.position).toEqual([20, 20])

            // Second: 20 + 100 + 15(gap) = 135
            expect(result.children?.[1]?.position).toEqual([20, 135])

            // Third: 135 + 150 + 15(gap) = 300
            expect(result.children?.[2]?.position).toEqual([20, 300])
        })

        it('should reduce auto-width by margins in flex column', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 100,
                            marginLeft: 25,
                            marginRight: 35,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Available width: 800 - 40(padding) = 760
            // Minus margins: 760 - 25 - 35 = 700
            expect(result.children?.[0]?.size?.[0]).toBe(700)
        })
    })

    describe('Nested Layouts', () => {
        it('should propagate parent size through nested layouts', () => {
            const layout: LayoutBox = {
                id: 'root',
                styles: {
                    width: 1000,
                    height: 800,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                },
                children: [
                    {
                        id: 'level1',
                        styles: {
                            height: 300,
                            padding: 15,
                            display: 'flex',
                            flexDirection: 'column',
                            // No width - should auto-fill
                        },
                        children: [
                            {
                                id: 'level2',
                                styles: {
                                    height: 100,
                                    // No width - should auto-fill
                                },
                            },
                        ],
                    },
                ],
            }

            const result = computeLayout(layout, { width: 1200, height: 1000 })

            // Level 1 should fill root minus padding: 1000 - 40 = 960
            expect(result.children?.[0]?.size?.[0]).toBe(960)

            // Level 2 should fill level1 minus its padding: 960 - 30 = 930
            expect(result.children?.[0]?.children?.[0]?.size?.[0]).toBe(930)
        })

        it('should compute correct coordinates for deeply nested elements', () => {
            const layout: LayoutBox = {
                id: 'root',
                styles: {
                    width: 1000,
                    height: 800,
                    padding: 10,
                    display: 'block',
                },
                children: [
                    {
                        id: 'level1',
                        styles: {
                            height: 200,
                            marginTop: 20,
                            padding: 5,
                            display: 'block',
                        },
                        children: [
                            {
                                id: 'level2',
                                styles: {
                                    height: 50,
                                    marginTop: 15,
                                },
                            },
                        ],
                    },
                ],
            }

            const result = computeLayout(layout)

            // Level 1 position: paddingTop + marginTop
            expect(result.children?.[0]?.position).toEqual([10, 30])

            // Level 2 position relative to level1: paddingTop + marginTop
            expect(result.children?.[0]?.children?.[0]?.position).toEqual([5, 20])
        })
    })

    describe('Padding and Spacing', () => {
        it('should handle shorthand padding', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: '10 20 30 40', // top right bottom left
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 100,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Child should be at left padding (40) and top padding (10)
            expect(result.children?.[0]?.position).toEqual([40, 10])

            // Width should account for left + right padding: 800 - 40 - 20 = 740
            expect(result.children?.[0]?.size?.[0]).toBe(740)
        })

        it('should handle individual padding properties', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    paddingTop: 25,
                    paddingRight: 15,
                    paddingBottom: 35,
                    paddingLeft: 45,
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 100,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Position should use individual padding values
            expect(result.children?.[0]?.position).toEqual([45, 25])

            // Width: 800 - 45(left) - 15(right) = 740
            expect(result.children?.[0]?.size?.[0]).toBe(740)
        })

        it('should prioritize individual padding over shorthand', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 20,
                    paddingLeft: 50, // Should override shorthand
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 100,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Left should use individual property
            expect(result.children?.[0]?.position?.[0]).toBe(50)

            // Width: 800 - 50(left override) - 20(right from shorthand) = 730
            expect(result.children?.[0]?.size?.[0]).toBe(730)
        })
    })

    describe('Edge Cases', () => {
        it('should handle empty children array', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                },
                children: [],
            }

            const result = computeLayout(layout)

            expect(result.children).toEqual([])
            expect(result.styles.width).toBe(800)
            expect(result.styles.height).toBe(600)
        })

        it('should handle no children', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                },
            }

            const result = computeLayout(layout)

            // When no children, returns empty array (consistent with empty children array case)
            expect(result.children).toEqual([])
        })

        it('should use fallback when no parent size and no explicit size', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            // No size specified
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Should use fallback size (100)
            expect(result.children?.[0]?.size?.[0]).toBe(100)
            expect(result.children?.[0]?.size?.[1]).toBe(100)
        })

        it('should handle very small parent sizes', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 50,
                    height: 30,
                    padding: 40, // Padding larger than size!
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 10,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            // Width would be negative (50 - 80), but should handle gracefully
            // Available width: 50 - 40 - 40 = -30
            expect(result.children?.[0]?.size?.[0]).toBe(-30)
        })

        it('should handle zero padding', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    width: 800,
                    height: 600,
                    padding: 0,
                    display: 'block',
                },
                children: [
                    {
                        id: 'child',
                        styles: {
                            height: 100,
                        },
                    },
                ],
            }

            const result = computeLayout(layout)

            expect(result.children?.[0]?.position).toEqual([0, 0])
            expect(result.children?.[0]?.size?.[0]).toBe(800)
        })
    })

    describe('Content Size Calculation', () => {
        it('should calculate total content width correctly', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                },
                children: [
                    { id: 'c1', styles: { width: 100, height: 50 } },
                    { id: 'c2', styles: { width: 150, height: 50 } },
                    { id: 'c3', styles: { width: 80, height: 50 } },
                ],
            }

            const result = computeLayout(layout)

            // Total width: 20(paddingLeft) + 100 + 10 + 150 + 10 + 80 + 20(paddingRight) = 390
            expect(result.styles._contentWidth).toBe(390)
        })

        it('should calculate total content height correctly for column', () => {
            const layout: LayoutBox = {
                id: 'parent',
                styles: {
                    padding: 15,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                },
                children: [
                    { id: 'c1', styles: { height: 80 } },
                    { id: 'c2', styles: { height: 120 } },
                    { id: 'c3', styles: { height: 60 } },
                ],
            }

            const result = computeLayout(layout)

            // Total height: 15(top) + 80 + 12 + 120 + 12 + 60 + 15(bottom) = 314
            expect(result.styles._contentHeight).toBe(314)
        })
    })
})
