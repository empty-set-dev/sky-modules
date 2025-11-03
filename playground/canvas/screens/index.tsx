import '@sky-modules/canvas/jsx.global'
import { PatternMaterial } from '@sky-modules/canvas/materials'
import { createSignal, onMount } from 'sky-jsx'
import { JSX } from 'sky-jsx'

import Rect from './Rect'

import art1Webp from '~public/images/art-1.webp'

export default function IndexScreen(): JSX.Element {
    const rects = Array(100)

    for (let i = 0; i < rects.length; i++) {
        rects[i] = new Rect()
    }

    // Создание CanvasImageSource из URL
    const [imageSource, setImageSource] = createSignal<HTMLImageElement | null>(null)

    onMount(() => {
        // Способ 1: Создать HTMLImageElement
        const img = new Image()
        img.onload = () => {
            setImageSource(img)
        }
        img.src = art1Webp

        // Способ 2: Использовать существующий элемент
        // const imgElement = document.getElementById('myImage') as HTMLImageElement
        // setImageSource(imgElement)

        // Способ 3: Создать из canvas
        // const canvas = document.createElement('canvas')
        // canvas.width = 100
        // canvas.height = 100
        // const ctx = canvas.getContext('2d')!
        // ctx.fillStyle = 'red'
        // ctx.fillRect(0, 0, 100, 100)
        // setImageSource(canvas)

        // Способ 4: Использовать ImageBitmap
        // fetch(art1Webp)
        //     .then(res => res.blob())
        //     .then(blob => createImageBitmap(blob))
        //     .then(bitmap => setImageSource(bitmap))
    })

    return (
        <>
            <Show when={imageSource()} keyed>
                {img => (
                    <Mesh>
                        <PatternMaterial
                            image={img}
                            repetition="repeat"
                            scale={(window.innerWidth / img.width) * 2}
                            rotation={0}
                            opacity={1}
                            globalCompositeOperation="darken"
                        />
                        <RectGeometry
                            x={0}
                            y={0}
                            width={window.innerWidth}
                            height={window.innerHeight}
                        />
                    </Mesh>
                )}
            </Show>
            {rects.map(rect => rect.render())}
        </>
    )
}
