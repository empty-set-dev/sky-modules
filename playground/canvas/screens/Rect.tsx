import Mesh from '@sky-modules/canvas/Mesh'
import { JSX } from 'sky-jsx'

export default class Rect {
    @number x = window.innerWidth * Math.random()
    @number y = Math.random() * -1000 - 100
    @number speed = 0
    @number size = Math.random() * 60 + 200

    update(dt: number): void {
        this.y += (this.speed * dt) / 2

        if (this.y >= window.innerHeight - this.size) {
            this.y = window.innerHeight - this.size

            if (Math.abs(this.speed) <= 2000 * dt) {
                this.speed = 0
            } else {
                this.speed = -Math.abs(this.speed)
            }
        } else {
            this.speed += 100 * dt
        }

        this.y += (this.speed * dt) / 2
    }

    render(): JSX.Element {
        return (
            <>
                <Mesh
                    position={[this.x - this.size / 2, this.y]}
                    onUpdate={(_: Mesh, __: number, dt: number) => this.update(dt)}
                >
                    <BasicMaterial
                        color="#FF99FF"
                        opacity={0.5}
                        globalCompositeOperation="color-burn"
                    />
                    <RectGeometry width={10} height={this.size} />
                </Mesh>
            </>
        )
    }
}
