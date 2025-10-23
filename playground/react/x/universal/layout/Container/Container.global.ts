import globalify from '@sky-modules/core/globalify';
import Container, * as imports from './Container';
declare global {
  const Container: typeof imports.default;
  type Container = typeof imports.default;
  type ContainerProps = imports.ContainerProps;
}
globalify({
  Container,
  ...imports
})