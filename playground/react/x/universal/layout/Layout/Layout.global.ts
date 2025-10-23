import globalify from '@sky-modules/core/globalify';
import Layout, * as imports from './Layout';
declare global {
  const Layout: typeof imports.default;
  type Layout = typeof imports.default;
  type LayoutProps = imports.LayoutProps;
}
globalify({
  Layout,
  ...imports
})