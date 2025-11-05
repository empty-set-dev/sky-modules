/**
 * Examples of using renderCSSToCanvas
 */

import { renderCSSToCanvas } from '../rendering/renderCSSToCanvas'

// Example 1: Render text with styles
const canvas1 = document.createElement('canvas')
const ctx1 = canvas1.getContext('2d')!

renderCSSToCanvas(
    ctx1,
    {
        fontSize: '24px',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#333',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    {
        text: 'Hello World!',
        x: 50,
        y: 50,
    }
)

// Example 2: Render box with background and border
const canvas2 = document.createElement('canvas')
const ctx2 = canvas2.getContext('2d')!

renderCSSToCanvas(
    ctx2,
    {
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#2E7D32',
        borderRadius: 10,
        boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
        width: 200,
        height: 100,
    },
    {
        x: 50,
        y: 50,
        box: true,
    }
)

// Example 3: Render styled text inside a box
const canvas3 = document.createElement('canvas')
const ctx3 = canvas3.getContext('2d')!

renderCSSToCanvas(
    ctx3,
    {
        // Box styles
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: '20px',
        width: 300,
        height: 150,

        // Text styles
        fontSize: '18px',
        fontFamily: 'sans-serif',
        color: 'white',
        textAlign: 'center',
        textBaseline: 'middle',
    },
    {
        text: 'Styled Button',
        x: 100,
        y: 100,
        box: true,
        fill: true,
    }
)

// Example 4: Using kebab-case CSS properties
const canvas4 = document.createElement('canvas')
const ctx4 = canvas4.getContext('2d')!

renderCSSToCanvas(
    ctx4,
    {
        'font-size': '16px',
        'font-family': 'monospace',
        'background-color': '#f5f5f5',
        'border-radius': 5,
        'text-shadow': '1px 1px 2px rgba(0,0,0,0.1)',
        padding: '10px',
    },
    {
        text: 'Code Block',
        x: 20,
        y: 20,
        box: true,
    }
)

// Example 5: Render with em/rem units
const canvas5 = document.createElement('canvas')
const ctx5 = canvas5.getContext('2d')!

renderCSSToCanvas(
    ctx5,
    {
        fontSize: '2em', // Will be converted to 32px
        color: '#E91E63',
    },
    {
        text: 'Large Text',
        x: 50,
        y: 50,
    }
)

// Example 6: Render with opacity
const canvas6 = document.createElement('canvas')
const ctx6 = canvas6.getContext('2d')!

renderCSSToCanvas(
    ctx6,
    {
        backgroundColor: 'blue',
        opacity: 0.5,
        width: 200,
        height: 100,
        borderRadius: 10,
    },
    {
        x: 50,
        y: 50,
        box: true,
    }
)

// Example 7: Stroke text instead of fill
const canvas7 = document.createElement('canvas')
const ctx7 = canvas7.getContext('2d')!

renderCSSToCanvas(
    ctx7,
    {
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#FF5722',
    },
    {
        text: 'Outline',
        x: 50,
        y: 100,
        fill: false,
        stroke: true,
    }
)

// Example 8: Clear canvas before rendering
const canvas8 = document.createElement('canvas')
const ctx8 = canvas8.getContext('2d')!

renderCSSToCanvas(
    ctx8,
    {
        fontSize: '20px',
        color: 'black',
    },
    {
        text: 'Fresh Start',
        x: 50,
        y: 50,
        clear: true, // Clears the entire canvas first
    }
)
