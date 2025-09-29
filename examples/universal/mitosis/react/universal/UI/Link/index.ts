import Link from './Link';
import LinkRoot from './LinkRoot';
import LinkSub from './LinkSub';
Object.assign(Link, LinkRoot, LinkSub);
export default Link as typeof Link & {
  Root: typeof LinkRoot;
  Sub: typeof LinkSub;
}