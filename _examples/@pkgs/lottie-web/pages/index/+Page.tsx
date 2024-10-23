import '#/imports'

import lottieExample from 'public/lottie/charts.json'
import Lottie from 'sky/components/Lottie'

export default function HomePage(): ReactNode {
    return <Lottie animationData={lottieExample} speed={1} />
}
