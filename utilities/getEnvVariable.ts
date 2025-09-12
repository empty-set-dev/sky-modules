export default function getEnvVariable(variableName: string): string {
    const { [variableName]: value } = process.env

    if (value == null) {
        throw new Error(`${variableName} is not defined`)
    }

    return value
}
