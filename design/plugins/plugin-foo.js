export default function ({ matchUtilities }) {
    matchUtilities(
        {
            foo: value => ({
                backgroundColor: value,
            }),
        },
        {
            values: {}, // пустой объект = поддержка только arbitrary values
        }
    )
}
