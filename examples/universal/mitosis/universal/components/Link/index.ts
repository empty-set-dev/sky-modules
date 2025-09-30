import Link from './Link.js';
import LinkRoot from './LinkRoot.js';
import LinkSub from './LinkSub.js';
Object.assign(Link, LinkRoot, LinkSub);
export default Link as typeof Link & {
  Root: typeof LinkRoot;
  Sub: typeof LinkSub;
}