import globalify from 'sky/utilities/globalify'

declare global {
    namespace Canvas {}
}

if (!global.Canvas) {
    globalify({ Canvas: {} })
}
