export default function getEnvVariable(variableName: string): string {
    const { [variableName]: value } = process.env

    if (!value) {
        throw Error(`${variableName} is undefined`)
    }

    return value
}
