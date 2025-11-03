import globalify from '@sky-modules/core/globalify';
import Col, * as imports from './Col';
declare global {
  const Col: typeof imports.default;
  type Col = typeof imports.default;
  type ColProps = imports.ColProps;
}
globalify({
  Col
})