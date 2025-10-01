import { LinkSx } from './Link.style.js';
export default function getBoxProps<T extends TagName = 'div'>(props: DesignSystem.SlotProps<T, typeof LinkSx>): BoxProps<T> {
  const {
    underline,
    ...boxProps
  } = props;
  underline;
  return boxProps as BoxProps<T>;
}