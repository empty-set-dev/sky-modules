// @vitest-environment jsdom

import './test-setup'
import { test, expect } from 'vitest'
import { CanvasJSXRenderer } from '../../jsx/jsx'
import Box from '../../jsx/box/Box'

test('debug Box rendering', () => {
    console.log('=== Testing Box component ===')

    // Create Box element
    const boxElement = {
        type: 'Box',
        props: {
            width: 100,
            height: 100,
            backgroundColor: '#ff0000',
            position: [50, 50]
        }
    }

    console.log('Box element:', JSON.stringify(boxElement, null, 2))

    // Call Box function directly
    const meshElement = Box(boxElement.props)
    console.log('Box() returns:', JSON.stringify(meshElement, null, 2))

    // Create renderer
    const renderer = new CanvasJSXRenderer()
    console.log('Scene children before render:', renderer.scene.children.length)

    // Render
    try {
        renderer.render(boxElement)
        console.log('Scene children after render:', renderer.scene.children.length)
        console.log('Scene children:', renderer.scene.children)
    } catch (error) {
        console.error('Render error:', error)
    }

    expect(renderer.scene.children.length).toBeGreaterThan(0)
})
