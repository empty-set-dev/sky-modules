import React from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.querySelector('#root')!)
root.render(<Test />)

function Test(): ReactNode {
    return <>Hello, Worlds!</>
}
