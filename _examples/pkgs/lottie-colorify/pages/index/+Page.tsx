import '../../../@artsy/fresnel/imports'

import lottieExample from 'public/lottie/logo.json'
import Lottie from 'sky/components/Lottie'
import { colorify, flatten, getColors, replaceColor } from 'sky/pkgs/lottie-colorify'

export default function HomePage(): ReactNode {
    logConsole(getColors(lottieExample))

    return (
        <>
            <Lottie animationData={colorify(Array(3).fill('#00FFFF'), lottieExample)} />
            <Lottie animationData={flatten('#FFFF00', lottieExample)} />
            <Lottie animationData={replaceColor([17, 85, 212], '#FF00FF', lottieExample)} />
        </>
    )
}
