import globalify from '@sky-modules/core/globalify';
import Layout_Root, * as imports from './Layout.Root';
declare global {
  const Layout_Root: typeof imports.default;
  type Layout_Root = typeof imports.default;
  type LayoutRootProps = imports.LayoutRootProps;
}
globalify({
  Layout_Root
})