import React from 'react'
import { createRoot } from 'react-dom/client'

declare global {
    const appPath: string
}

const App = (await import(/* @vite-ignore */ appPath)).default as React.FC

const root = createRoot(document.getElementById('root'))
root.render(<App />)
