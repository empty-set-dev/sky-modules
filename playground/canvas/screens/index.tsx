import '@sky-modules/canvas/jsx.global'

import { JSX } from 'sky-jsx'

import Rect from './Rect'

export default function IndexScreen(): JSX.Element {
    const rects = Array(100)

    for (let i = 0; i < rects.length; i++) {
        rects[i] = new Rect()
    }

    return <>{rects.map(rect => rect.render())}</>
}
