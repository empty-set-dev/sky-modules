import '@sky-modules/canvas/jsx.global'
import { PatternMaterial } from '@sky-modules/canvas/materials'
import { createSignal, onMount, Show } from 'sky-jsx'
import { JSX } from 'sky-jsx'

import Rect from './Rect'

import art1Webp from '~public/images/art-1.webp'

export default function IndexScreen(): JSX.Element {
    const rects = Array(100)

    for (let i = 0; i < rects.length; i++) {
        rects[i] = new Rect()
    }

    const [imageSource, setImageSource] = createSignal<HTMLImageElement | undefined>()

    const canvas = useCanvas()

    onMount(() => {
        const image = new Image()
        image.onload = () => {
            setImageSource(image)
        }
        image.src = art1Webp
    })

    return (
        <>
            {Show({
                when: imageSource(),
                keyed: true,
                children: image => {
                    const scale = () =>
                        Math.max(
                            (window.innerWidth * canvas.pixelRatio) / image.width,
                            (window.innerHeight * canvas.pixelRatio) / image.height
                        )
                    return (
                        <Mesh>
                            <PatternMaterial
                                image={image}
                                repetition="repeat"
                                scale={scale()}
                                rotation={0}
                                opacity={1}
                                offsetX={
                                    window.innerWidth / 2 -
                                    (image.width * scale()) / 2 / canvas.pixelRatio
                                }
                                offsetY={
                                    window.innerHeight / 2 -
                                    (image.height * scale()) / 2 / canvas.pixelRatio
                                }
                            />
                            <RectGeometry
                                x={0}
                                y={0}
                                width={window.innerWidth}
                                height={window.innerHeight}
                            />
                        </Mesh>
                    )
                },
            })}
            {rects.map(rect => rect.render())}
        </>
    )
}
