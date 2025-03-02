import globalify from 'sky/helpers/globalify'

declare global {
    namespace Canvas {}
}

if (!global.Canvas) {
    globalify({ Canvas: {} })
}
