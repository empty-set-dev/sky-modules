import globalify from '@sky-modules/core/globalify';
import * as imports from './types';
declare global {
  type SlotRootContextType = imports.SlotRootContextType;
  type SlotRootStyles = imports.SlotRootStyles;
  type SlotRootController = imports.SlotRootController;
}
globalify({
  ...imports
})