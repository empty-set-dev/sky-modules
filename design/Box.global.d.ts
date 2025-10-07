import { ClassValue } from 'clsx';
import { HTMLStyledProps } from 'sky/.dev/styled-system/types';
declare global {
    namespace Mitosis {
        type Node = any;
        type Children = any;
        type Ref = unknown;
    }
    type TagName = keyof HTMLElementTagNameMap;
    type BoxSxProp = ClassValue;
    type PandaProps = Omit<HTMLStyledProps<'div'>, 'ref' | 'children' | 'className' | 'class'>;
    type BoxOwnProps = PandaProps & {
        sx?: BoxSxProp | undefined;
        children?: Mitosis.Children | undefined;
        asChild?: boolean | undefined;
        ref?: Mitosis.Ref | undefined;
        class?: ClassValue | undefined;
        className?: ClassValue | undefined;
    };
    type BoxElementProps<T extends TagName = 'div'> = Partial<Omit<HTMLElementTagNameMap[T], 'class' | 'className' | 'children'>> & {
        as?: T | undefined;
    };
    type BoxComponentProps<P extends Record<string, unknown>> = P & {
        as?: ((props: P) => Mitosis.Node) | TagName | undefined;
    };
    type BoxAs = TagName | ((props: {}) => Mitosis.Node);
    type BoxProps<T = 'div'> = T extends TagName ? BoxElementProps<T> & BoxOwnProps : T extends (props: infer P extends Record<string, unknown>) => Mitosis.Node ? BoxComponentProps<P> & BoxOwnProps : never;
    function Box<T extends BoxAs = 'div'>(props: BoxElementProps<T extends TagName ? T : 'div'> | BoxComponentProps<T extends (...args: any[]) => any ? Parameters<T>[0] : Record<string, unknown>>): Mitosis.Node;
}
//# sourceMappingURL=Box.global.d.ts.map