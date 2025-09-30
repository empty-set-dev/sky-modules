import classnames from '@sky-modules/helpers/cn'
import lottie, { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'
import { CSSProperties, ReactNode, useEffect, useRef } from 'react'

const cx = classnames()

export default function Lottie(
    props: Omit<AnimationConfigWithPath<'svg'> & AnimationConfigWithData<'svg'>, 'container'> & {
        className?: string
        style?: CSSProperties
        speed?: number
    } & PropsWithChildren
): ReactNode {
    const { renderer, loop, autoplay, className, style, speed } = props
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if (ref.current == null) {
            return
        }

        const animation = lottie.loadAnimation({
            ...props,
            container: ref.current,
            renderer: renderer ?? 'svg',
            loop: loop ?? true,
            autoplay: autoplay ?? true,
        })

        speed && animation.setSpeed(speed)

        return (): void => {
            animation.destroy()
        }
    }, [ref, renderer, loop, autoplay, speed, props])

    return <i ref={ref} className={cx`[Lottie] ${className}`} style={style}></i>
}
