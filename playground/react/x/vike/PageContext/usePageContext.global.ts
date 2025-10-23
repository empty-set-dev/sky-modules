import globalify from '@sky-modules/core/globalify';
import usePageContext, * as imports from './usePageContext';
declare global {
  const usePageContext: typeof imports.default;
  type usePageContext = typeof imports.default;
}
globalify({
  usePageContext,
  ...imports
})