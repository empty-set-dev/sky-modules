import globalify from '@sky-modules/core/globalify'

import ThirdPersonCameraController, * as imports from '../ThirdPersonCameraController'

declare global {
    const ThirdPersonCameraController: typeof imports.default
    type ThirdPersonCameraController = typeof imports.default
    type ThirdPersonCameraControllerParameters = imports.ThirdPersonCameraControllerParameters
}

globalify({ ThirdPersonCameraController })
