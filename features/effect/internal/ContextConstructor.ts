import PublicContextConstructor from '../ContextConstructor'

type ContextConstructor = PublicContextConstructor & {
    __name: string
    constructor: object
}
export default ContextConstructor
