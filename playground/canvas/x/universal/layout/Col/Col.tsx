import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Col.lite.css'

export type ColProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof colRecipe, T> & {
inputRef?: unknown;
}

    import  clsx from 'clsx';
import  { colRecipe } from './Col.recipe';

    function Col<T extends BoxAs = 'div'>(props:ColProps<T>) {

            // Preserved local variables (added by local-vars-plugin)
    const span = props.span;
    const offset = props.offset;
    const push = props.push;
    const pull = props.pull;
    const xs = props.xs;
    const sm = props.sm;
    const md = props.md;
    const lg = props.lg;
    const xl = props.xl;
    const unstyled = props.unstyled;
    const recipe = props.recipe;
    const sx = props.sx;
    const boxProps = (({ span, offset, push, pull, xs, sm, md, lg, xl, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
    const styles = unstyled ||
                (recipe ??
                        colRecipe({
                                span,
                                offset,
                                push,
                                pull,
                                xs,
                                sm,
                                md,
                                lg,
                                xl,
                        }));

let inputRef;

        return (<>
            <Box  {...(boxProps)}  ref={inputRef!}  sx={clsx(sx, styles)} >{props.children}</Box>

            </>)
    }

    export default Col;
