import globalify from '@sky-modules/core/globalify';
import Grid_Item, * as imports from './Grid.Item';
declare global {
  const Grid_Item: typeof imports.default;
  type Grid_Item = typeof imports.default;
  type GridItemProps = imports.GridItemProps;
}
globalify({
  Grid_Item,
  ...imports
})