import '#/imports'

import { createRoot } from 'react-dom/client'

import App from './App'

import './index.scss'

const app = new App()

createRoot(document.getElementById('root')!).render(app.render())

const timer = new Timer()

let start = Date.now()
while (true) {
    await timer.wait(Time(0.5))
    Console.log(Date.now() - start)
}
