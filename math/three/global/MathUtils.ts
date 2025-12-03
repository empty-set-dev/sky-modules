import globalify from '@sky-modules/core/globalify'

import * as imports from '../MathUtils'

declare global {
    const DEG2RAD: typeof imports.DEG2RAD
    const RAD2DEG: typeof imports.RAD2DEG
    const generateUUID: typeof imports.generateUUID
    const clamp: typeof imports.clamp
    const euclideanModulo: typeof imports.euclideanModulo
    const mapLinear: typeof imports.mapLinear
    const inverseLerp: typeof imports.inverseLerp
    const lerp: typeof imports.lerp
    const damp: typeof imports.damp
    const pingpong: typeof imports.pingpong
    const smoothstep: typeof imports.smoothstep
    const smootherstep: typeof imports.smootherstep
    const randInt: typeof imports.randInt
    const randFloat: typeof imports.randFloat
    const randFloatSpread: typeof imports.randFloatSpread
    const seededRandom: typeof imports.seededRandom
    const degToRad: typeof imports.degToRad
    const radToDeg: typeof imports.radToDeg
    const isPowerOfTwo: typeof imports.isPowerOfTwo
    const ceilPowerOfTwo: typeof imports.ceilPowerOfTwo
    const floorPowerOfTwo: typeof imports.floorPowerOfTwo
    const setQuaternionFromProperEuler: typeof imports.setQuaternionFromProperEuler
    const normalize: typeof imports.normalize
    const denormalize: typeof imports.denormalize
    const MathUtils: typeof imports.MathUtils
}

globalify({ ...imports })
