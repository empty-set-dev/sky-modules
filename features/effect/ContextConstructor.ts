// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContextConstructor = { new (...args: any[]): any; context: true }
export default ContextConstructor
