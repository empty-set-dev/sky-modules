import classnames from 'helpers/classnames'
import React, { ReactNode, useEffect, useRef } from 'includes/react'
import bodymovin, { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'

const cx = classnames()

export default function Lottie(
    props: Omit<AnimationConfigWithPath<'svg'> & AnimationConfigWithData<'svg'>, 'container'> & {
        className?: string
    }
): ReactNode {
    const { renderer, loop, autoplay, className } = props
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const animation = bodymovin.loadAnimation({
            ...props,
            container: ref.current!,
            renderer: renderer ?? 'svg',
            loop: loop ?? true,
            autoplay: autoplay ?? true,
        })

        return () => {
            animation.destroy()
        }
    }, [ref, renderer, loop, autoplay, props])

    return <span ref={ref} className={cx`${className}, lottie`}></span>
}
