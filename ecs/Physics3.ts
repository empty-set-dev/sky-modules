import '@sky-modules/features/ecs/global'
import Vector3 from '@sky-modules/math/Vector3'

declare global {
    interface Entity {
        physics3: Physics3
    }

    interface Systems {
        Physics3System: Physics3System
    }
}

/**
 * 3D physics component for entities
 *
 * Provides position, velocity, acceleration tracking with friction simulation for 3D space.
 * Supports both constant friction (meters/second) and linear friction (percentage/millisecond).
 *
 * @example Basic usage
 * ```typescript
 * import '@sky-modules/ecs/Physics3'
 *
 * const entity = new Entity()
 * entity.physics3.position.set(0, 0, 0)
 * entity.physics3.velocity.set(1, 0, 0)
 * entity.physics3.friction = (5).asMetersPerSecond
 * ```
 *
 * @example With acceleration
 * ```typescript
 * // Apply gravity
 * entity.physics3.acceleration.set(0, 0, -9.8)
 * ```
 */
class Physics3 extends Component {
    /** Current position in 3D space */
    position: Vector3 = new Vector3()

    /** Current velocity vector (units per second) */
    velocity: Vector3 = new Vector3()

    /** Acceleration vector (units per second squared) */
    acceleration: Vector3 = new Vector3()

    /** Constant friction force opposing motion (meters per second) */
    friction: MetersPerSecond = (0).asMetersPerSecond

    /** Percentage-based friction reducing velocity each millisecond (0-100%) */
    linearFriction: PercentsPerMillisecond = (0).asPercentsPerMillisecond
}
defineComponent('physics3', Physics3)

/**
 * System for processing 3D physics simulation
 *
 * Updates all entities with physics3 component every frame:
 * 1. Applies acceleration to velocity
 * 2. Applies velocity to position
 * 3. Applies friction forces to velocity
 * 4. Applies linear friction (percentage decay)
 *
 * Friction stops velocity when it would be less than the friction force applied.
 * Linear friction is applied exponentially based on delta time.
 *
 * @example Register system
 * ```typescript
 * import '@sky-modules/ecs/Physics3'
 *
 * // System is automatically registered
 * // Update is called every frame
 * ```
 */
class Physics3System extends System {
    static components = ['physics3']

    /**
     * Update individual entity physics
     *
     * @param entity - Entity with physics3 component
     * @param ev - Update event with delta time
     */
    updateEntity(entity: Entity, ev: Sky.UpdateEvent): void {
        const { position, velocity, acceleration, friction, linearFriction } = entity.physics3

        // Apply acceleration
        velocity.add(new Vector3().copy(acceleration).multiplyScalar(ev.dt))
        // Apply velocity
        position.add(new Vector3().copy(velocity).multiplyScalar(ev.dt))

        // Apply constant friction (stops motion when velocity is low)
        if (friction.valueOf() * ev.dt * friction.valueOf() * ev.dt >= velocity.lengthSq()) {
            velocity.set(0, 0, 0)
        } else {
            velocity.sub(
                new Vector3()
                    .copy(velocity)
                    .normalize()
                    .multiplyScalar(friction.valueOf() * ev.dt)
            )
        }

        // Apply linear friction (percentage decay)
        velocity.multiplyScalar(Math.pow(1 - linearFriction.valueOf() * 0.01, ev.dt * 1000))
    }

    /**
     * Update all entities with physics3 component
     *
     * @param ev - Update event with delta time
     */
    protected update(ev: Sky.UpdateEvent): void {
        for (const entity of this.entities) {
            this.updateEntity(entity, ev)
        }
    }
}

defineSystem('Physics3System', Physics3System)
