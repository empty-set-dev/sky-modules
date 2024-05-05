import 'helpers/global'
import 'features/ecs/global'

await idle(1000)

// eslint-disable-next-line no-console
console.log('Hello, world!')

@entity
class Demo extends Entity {}