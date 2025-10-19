import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

export type AspectRatioProps<T extends BoxAs = 'div'> = BoxProps<T> & {
inputRef?: unknown;
aspectRatio?: number;
}

  function AspectRatio(props:AspectRatioProps<T>) {

      // Preserved local variables (added by local-vars-plugin)
  const aspectRatio = props.aspectRatio;
  const boxProps = (({ aspectRatio, ...rest }) => rest)(props);

return (<>
      <Box  {...(boxProps)}  ref={inputRef!}  style={{
"aspect-ratio": aspectRatio ?? 1
}} >{props.children}</Box>

      </>)
  }

  export default forwardRef(AspectRatio) as typeof AspectRatio
