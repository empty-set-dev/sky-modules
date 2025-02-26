export default function getEnvVariable(variable: string): string {
    const { [variable]: value } = process.env

    if (!value) {
        throw Error(`${variable} is undefined`)
    }

    return value
}
