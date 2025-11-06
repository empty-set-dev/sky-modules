import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Text.lite.css'

export type TextProps<T extends BoxAs = 'p'> = Design.SlotRootProps<typeof textRecipe, T> & {
inputRef?: unknown;
noOfLines?: number;
}

    import  clsx from 'clsx';
import  { textRecipe } from './Text.recipe';

    function Text<T extends BoxAs = 'p'>(props:TextProps<T>) {

            // Preserved local variables (added by local-vars-plugin)
    const size = props.size;
    const align = props.align;
    const casing = props.casing;
    const decoration = props.decoration;
    const truncate = props.truncate;
    const noWrap = props.noWrap;
    const noOfLines = props.noOfLines;
    const unstyled = props.unstyled;
    const recipe = props.recipe;
    const sx = props.sx;
    const boxProps = (({ size, align, casing, decoration, truncate, noWrap, noOfLines, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
    const styles = unstyled ||
                (recipe ??
                        textRecipe({
                                size,
                                align,
                                casing,
                                decoration,
                                truncate,
                                noWrap,
                        }));
    const lineClampStyles = noOfLines
                ? {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: noOfLines,
                    }
                : undefined;

let inputRef;

        return (<>
            <Box  {...(boxProps)}  ref={inputRef!}  sx={clsx(sx, styles)}  style={lineClampStyles} >{props.children}</Box>

            </>)
    }

    export default Text;
