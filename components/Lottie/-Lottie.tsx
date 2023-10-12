import classnames from 'helpers/classnames'
import lottie, { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'
import { CSSProperties, ReactNode, useEffect, useRef } from 'react'

const cx = classnames({})

export default function Lottie(
    props: Omit<AnimationConfigWithPath<'svg'> & AnimationConfigWithData<'svg'>, 'container'> & {
        className?: string
        style?: CSSProperties
        speed?: number
    }
): ReactNode {
    const { renderer, loop, autoplay, className, style, speed } = props
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const animation = lottie.loadAnimation({
            ...props,
            container: ref.current!,
            renderer: renderer ?? 'svg',
            loop: loop ?? true,
            autoplay: autoplay ?? true,
        })

        speed && animation.setSpeed(speed)

        return () => {
            animation.destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, renderer, loop, autoplay, speed])

    return <i ref={ref} className={cx`${className} lottie`} style={style}></i>
}
