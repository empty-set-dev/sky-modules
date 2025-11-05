/**
 * Examples of using renderCSSToCanvas with Flexbox and Grid layouts
 */

import { renderCSSToCanvas } from '../rendering/renderCSSToCanvas'

// Example 1: Flexbox - Horizontal layout with gap
const canvas1 = document.createElement('canvas')
canvas1.width = 600
canvas1.height = 200
const ctx1 = canvas1.getContext('2d')!

renderCSSToCanvas(
    ctx1,
    {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#f0f0f0',
        padding: '20px',
        width: 600,
        height: 200,
    },
    {
        x: 0,
        y: 0,
        box: true,
        children: [
            {
                css: {
                    width: 100,
                    height: 100,
                    backgroundColor: '#FF6B6B',
                    borderRadius: 10,
                },
            },
            {
                css: {
                    width: 100,
                    height: 100,
                    backgroundColor: '#4ECDC4',
                    borderRadius: 10,
                },
            },
            {
                css: {
                    width: 100,
                    height: 100,
                    backgroundColor: '#45B7D1',
                    borderRadius: 10,
                },
            },
        ],
    }
)

// Example 2: Flexbox - Vertical layout centered
const canvas2 = document.createElement('canvas')
canvas2.width = 300
canvas2.height = 600
const ctx2 = canvas2.getContext('2d')!

renderCSSToCanvas(
    ctx2,
    {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        backgroundColor: '#2C3E50',
        width: 300,
        height: 600,
    },
    {
        x: 0,
        y: 0,
        box: true,
        children: [
            {
                css: {
                    width: 250,
                    height: 80,
                    backgroundColor: '#E74C3C',
                    borderRadius: 8,
                    fontSize: '18px',
                    color: 'white',
                },
                options: {
                    text: 'Button 1',
                },
            },
            {
                css: {
                    width: 250,
                    height: 80,
                    backgroundColor: '#3498DB',
                    borderRadius: 8,
                },
                options: {
                    text: 'Button 2',
                },
            },
            {
                css: {
                    width: 250,
                    height: 80,
                    backgroundColor: '#2ECC71',
                    borderRadius: 8,
                },
                options: {
                    text: 'Button 3',
                },
            },
        ],
    }
)

// Example 3: Flexbox - space-evenly
const canvas3 = document.createElement('canvas')
canvas3.width = 800
canvas3.height = 150
const ctx3 = canvas3.getContext('2d')!

renderCSSToCanvas(
    ctx3,
    {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#ddd',
        width: 800,
        height: 150,
    },
    {
        x: 0,
        y: 0,
        box: true,
        children: [
            {
                css: {
                    width: 120,
                    height: 120,
                    backgroundColor: '#FF9FF3',
                    borderRadius: 60, // Circle
                },
            },
            {
                css: {
                    width: 120,
                    height: 120,
                    backgroundColor: '#FECA57',
                    borderRadius: 60,
                },
            },
            {
                css: {
                    width: 120,
                    height: 120,
                    backgroundColor: '#48DBFB',
                    borderRadius: 60,
                },
            },
            {
                css: {
                    width: 120,
                    height: 120,
                    backgroundColor: '#1DD1A1',
                    borderRadius: 60,
                },
            },
        ],
    }
)

// Example 4: Grid - 3 columns
const canvas4 = document.createElement('canvas')
canvas4.width = 600
canvas4.height = 400
const ctx4 = canvas4.getContext('2d')!

renderCSSToCanvas(
    ctx4,
    {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 15,
        backgroundColor: '#ECF0F1',
        padding: '20px',
        width: 600,
        height: 400,
    },
    {
        x: 0,
        y: 0,
        box: true,
        children: [
            {
                css: { backgroundColor: '#E67E22', borderRadius: 5 },
            },
            {
                css: { backgroundColor: '#9B59B6', borderRadius: 5 },
            },
            {
                css: { backgroundColor: '#3498DB', borderRadius: 5 },
            },
            {
                css: { backgroundColor: '#1ABC9C', borderRadius: 5 },
            },
            {
                css: { backgroundColor: '#F39C12', borderRadius: 5 },
            },
            {
                css: { backgroundColor: '#E74C3C', borderRadius: 5 },
            },
        ],
    }
)

// Example 5: Grid - 2x2 with different sizes
const canvas5 = document.createElement('canvas')
canvas5.width = 500
canvas5.height = 500
const ctx5 = canvas5.getContext('2d')!

renderCSSToCanvas(
    ctx5,
    {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: '1fr 2fr',
        gap: 10,
        backgroundColor: '#34495E',
        padding: '15px',
        width: 500,
        height: 500,
    },
    {
        x: 0,
        y: 0,
        box: true,
        children: [
            {
                css: {
                    backgroundColor: '#16A085',
                    borderRadius: 8,
                    fontSize: '24px',
                    color: 'white',
                },
                options: {
                    text: 'Large',
                },
            },
            {
                css: {
                    backgroundColor: '#27AE60',
                    borderRadius: 8,
                },
                options: {
                    text: 'Small',
                },
            },
            {
                css: {
                    backgroundColor: '#2980B9',
                    borderRadius: 8,
                },
                options: {
                    text: 'Tall',
                },
            },
            {
                css: {
                    backgroundColor: '#8E44AD',
                    borderRadius: 8,
                },
                options: {
                    text: 'Compact',
                },
            },
        ],
    }
)

// Example 6: Flexbox with nested text
const canvas6 = document.createElement('canvas')
canvas6.width = 700
canvas6.height = 250
const ctx6 = canvas6.getContext('2d')!

renderCSSToCanvas(
    ctx6,
    {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: 25,
        backgroundColor: 'linear-gradient(to right, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        width: 700,
        height: 250,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    {
        x: 0,
        y: 0,
        box: true,
        children: [
            {
                css: {
                    width: 150,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    fontSize: '16px',
                    color: '#333',
                },
                options: {
                    text: 'Card 1',
                    box: true,
                },
            },
            {
                css: {
                    width: 150,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
                options: {
                    text: 'Card 2',
                    box: true,
                },
            },
            {
                css: {
                    width: 150,
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
                options: {
                    text: 'Card 3',
                    box: true,
                },
            },
        ],
    }
)

// Example 7: Grid - Auto layout (square grid)
const canvas7 = document.createElement('canvas')
canvas7.width = 600
canvas7.height = 600
const ctx7 = canvas7.getContext('2d')!

renderCSSToCanvas(
    ctx7,
    {
        display: 'grid',
        gridTemplateColumns: 'auto', // Auto-calculate based on children count
        gap: 8,
        backgroundColor: '#F8F9FA',
        padding: '10px',
        width: 600,
        height: 600,
    },
    {
        x: 0,
        y: 0,
        box: true,
        children: Array.from({ length: 9 }, (_, i) => ({
            css: {
                backgroundColor: `hsl(${i * 40}, 70%, 60%)`,
                borderRadius: 6,
                fontSize: '32px',
                color: 'white',
            },
            options: {
                text: `${i + 1}`,
            },
        })),
    }
)
