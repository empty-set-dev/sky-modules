import linkStyles from './Link.styles.js';
export function extractBoxProps<T extends BoxAs = 'a'>(props: DesignSystem.SlotProps<T, typeof linkStyles, void>): BoxProps<T> {
  const {
    underline,
    ...boxProps
  } = props;
  underline;
  return boxProps as BoxProps<T>;
}