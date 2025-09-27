export default function getCommandMode(
    command: string,
    subCommand?: null | string
): 'development' | 'test' | 'production' {
    let mode = 'development' as 'development' | 'test' | 'production'

    if (command === 'test') {
        mode = 'test'
    }

    if (command === 'readme') {
        mode = 'production'
    }

    if (command === 'web' && subCommand === 'dev') {
        mode = 'development'
    }

    if (command === 'web' && subCommand === 'build') {
        mode = 'production'
    }

    if (command === 'web' && subCommand === 'preview') {
        mode = 'production'
    }

    if (command === 'web' && subCommand === 'start') {
        mode = 'production'
    }

    if (command === 'node' && subCommand === 'dev') {
        mode = 'development'
    }

    if (command === 'node' && subCommand === 'start') {
        mode = 'production'
    }

    if (command === 'desktop' && subCommand === 'dev') {
        mode = 'development'
    }

    if (command === 'desktop' && subCommand === 'build') {
        mode = 'production'
    }

    if (command === 'desktop' && subCommand === 'start') {
        mode = 'production'
    }

    return mode
}
