/**
 * Retrieves an environment variable value with validation.
 *
 * Reads from process.env and throws an error if the variable is not defined.
 * Provides type-safe access to environment variables with runtime validation.
 *
 * @param variableName Name of the environment variable to retrieve
 * @returns The environment variable value
 * @throws Error if the environment variable is not defined
 *
 * @example Reading configuration
 * ```typescript
 * import getEnvVariable from '@sky-modules/utilities/getEnvVariable'
 *
 * const apiKey = getEnvVariable('API_KEY')
 * const databaseUrl = getEnvVariable('DATABASE_URL')
 *
 * console.log(`Connecting to: ${databaseUrl}`)
 * ```
 *
 * @example With error handling
 * ```typescript
 * try {
 *   const secretKey = getEnvVariable('SECRET_KEY')
 *   initializeAuth(secretKey)
 * } catch (error) {
 *   console.error('Missing required SECRET_KEY environment variable')
 *   process.exit(1)
 * }
 * ```
 *
 * @example Server configuration
 * ```typescript
 * const port = parseInt(getEnvVariable('PORT'))
 * const host = getEnvVariable('HOST')
 * const nodeEnv = getEnvVariable('NODE_ENV')
 *
 * app.listen(port, host, () => {
 *   console.log(`Server running in ${nodeEnv} mode on ${host}:${port}`)
 * })
 * ```
 */
export default function getEnvVariable(variableName: string): string {
    const { [variableName]: value } = process.env

    if (value == null) {
        throw new Error(`${variableName} is not defined`)
    }

    return value
}
