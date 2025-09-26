import fs from 'fs'
import path from 'path'

export default function rmDeep(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        return
    }

    const dirs = fs.readdirSync(dirPath)
    dirs.forEach(dir => {
        const subDirPath = path.join(dirPath, dir)

        if (fs.statSync(subDirPath).isDirectory()) {
            rmDeep(subDirPath)
        } else {
            fs.rmSync(subDirPath)
        }
    })

    fs.rmdirSync(dirPath)
}