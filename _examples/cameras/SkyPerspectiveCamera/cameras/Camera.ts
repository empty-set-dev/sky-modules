import SkyPerspectiveCamera from 'sky/cameras/SkyPerspectiveCamera'

import type App from '#/App'

export default class Camera extends Effect {
    camera: SkyPerspectiveCamera

    constructor(deps: EffectDeps) {
        super(deps)

        const camera = (this.camera = new SkyPerspectiveCamera(this))
        const cameraVector = new Vector2(-3, 4)
        let cameraDistanceFactor = 1
        camera.position.y = cameraVector.x
        camera.position.z = cameraVector.y
        camera.lookAt(new Vector3())

        new WindowEventListener(
            'wheel',
            ev => {
                cameraDistanceFactor -= ev.deltaY / 100
                cameraDistanceFactor = Math.minmax(cameraDistanceFactor, 0.5, 2)
                camera.position.y = cameraVector.x * cameraDistanceFactor
                camera.position.z = cameraVector.y * cameraDistanceFactor
            },
            this
        )
    }

    onAppContext(app: App): void {
        inScene(app.scene, this.camera, this)
    }
}
