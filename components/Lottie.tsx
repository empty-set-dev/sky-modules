import lottie, { AnimationConfigWithData, AnimationConfigWithPath } from '@pkgs/lottie-web'
import { CSSProperties, ReactNode, useEffect, useRef } from 'react'
import classnames from 'sky/helpers/classNames'

const cx = classnames('[Lottie]')
export default function Lottie(
    props: Omit<AnimationConfigWithPath<'svg'> & AnimationConfigWithData<'svg'>, 'container'> & {
        className?: string
        style?: CSSProperties
        speed?: number
    }
): ReactNode {
    const { renderer, loop, autoplay, className, style, speed } = props
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if (!ref.current) {
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
