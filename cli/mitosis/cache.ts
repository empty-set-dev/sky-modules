import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

interface CacheEntry {
    mtime: number
    hash: string
}

export class MitosisCache {
    private cacheFile: string
    private cache: Map<string, CacheEntry> = new Map()

    constructor(cacheDir: string) {
        this.cacheFile = path.join(cacheDir, 'mitosis-cache.json')
        this.loadCache()
    }

    private loadCache(): void {
        try {
            if (fs.existsSync(this.cacheFile)) {
                const data = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'))
                this.cache = new Map(Object.entries(data))
            }
        } catch {
            // Ignore cache load errors
            this.cache = new Map()
        }
    }

    private saveCache(): void {
        try {
            const cacheDir = path.dirname(this.cacheFile)

            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true })
            }

            const data = Object.fromEntries(this.cache)
            fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2))
        } catch {
            // Ignore cache save errors
        }
    }

    private getFileHash(filePath: string): string {
        try {
            const content = fs.readFileSync(filePath, 'utf8')
            return crypto.createHash('md5').update(content).digest('hex')
        } catch {
            return ''
        }
    }

    isFileChanged(filePath: string): boolean {
        try {
            const stats = fs.statSync(filePath)
            const mtime = stats.mtimeMs
            const hash = this.getFileHash(filePath)

            const cached = this.cache.get(filePath)

            if (!cached) {
                // File not in cache - consider it changed
                // Don't save to cache yet - wait for markFileProcessed after successful build
                return true
            }

            // Check if file was modified or content changed
            if (cached.mtime !== mtime || cached.hash !== hash) {
                // Don't save to cache yet - wait for markFileProcessed after successful build
                return true
            }

            return false
        } catch {
            // If can't read file, consider it changed
            return true
        }
    }

    markFileProcessed(filePath: string): void {
        try {
            const stats = fs.statSync(filePath)
            const mtime = stats.mtimeMs
            const hash = this.getFileHash(filePath)

            this.cache.set(filePath, { mtime, hash })
            this.saveCache()
        } catch {
            // Ignore errors
        }
    }

    getChangedFiles(files: string[]): string[] {
        return files.filter(file => this.isFileChanged(file))
    }

    clearCache(): void {
        this.cache.clear()
        try {
            if (fs.existsSync(this.cacheFile)) {
                fs.unlinkSync(this.cacheFile)
            }
        } catch {
            // Ignore errors
        }
    }
}
