export default function ({ matchUtilities }: { matchUtilities: Function }): void {
    matchUtilities(
        {
            boo: (value: string) => ({
                color: value,
            }),
        },
        {
            values: {
                'test': 'red',
            },
        }
    )
}
