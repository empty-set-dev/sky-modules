declare global {
    interface Foo {}
    const Foo: Foo
}
export default function foo<T1, T2>(namespace: T1, module: T2): asserts namespace is T1 & T2 {}
