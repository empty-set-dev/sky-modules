import globalify from '@sky-modules/core/globalify';
import usePopover, * as imports from './usePopover';
declare global {
  const usePopover: typeof imports.default;
  type usePopover = typeof imports.default;
  type UsePopoverParameters = imports.UsePopoverParameters;
}
globalify({
  usePopover
})