export default function ({ matchUtilities }) {
    matchUtilities(
        {
            foo: value => ({
                backgroundColor: value,
            }),
        },
        {
            values: {},
        }
    )
}
