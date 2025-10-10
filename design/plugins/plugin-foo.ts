export default function ({ matchUtilities }: { matchUtilities: Function }): void {
    matchUtilities(
        {
            foo: (value: string) => ({
                backgroundColor: value,
            }),
        },
        {
            values: {},
        }
    )
}
