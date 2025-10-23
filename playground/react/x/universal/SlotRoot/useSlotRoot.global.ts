import globalify from '@sky-modules/core/globalify';
import useSlotRoot, * as imports from './useSlotRoot';
declare global {
  const useSlotRoot: typeof imports.default;
  type useSlotRoot = typeof imports.default;
}
globalify({
  useSlotRoot,
  ...imports
})