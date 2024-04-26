import fs from 'fs'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    namespace fs {
        function copyFilesSync(from: string, to: string): void
    }
}

Array.prototype.has = defineEffect(function <T>(this: T[], resolve, element: T) {
    this.push(element)
    return (): void => {
        this.remove(element)
    }
})
