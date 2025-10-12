/**
 * Deep partial utility type
 * Makes all properties in T optional recursively
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
export default DeepPartial
