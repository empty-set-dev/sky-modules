import Link from './Link.lite'
import LinkRoot from './LinkRoot.lite'
import LinkSub from './LinkSub.lite'

Object.assign(Link, LinkRoot, LinkSub)

export default Link as typeof Link & {
    Root: typeof LinkRoot
    Sub: typeof LinkSub
}
