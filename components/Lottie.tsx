import { AnimationConfigWithData, AnimationConfigWithPath } from 'pkgs/lottie-web'
import { CSSProperties, ReactNode, useEffect, useRef } from 'react'
import classnames from 'sky/helpers/classNames'
import runsOnServerSide from 'sky/platform/web/utilities/runsOnServerSide'

let lottie: (typeof import('pkgs/lottie-web'))['default']

if (!runsOnServerSide) {
    lottie = (await import('pkgs/lottie-web')).default
}

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
