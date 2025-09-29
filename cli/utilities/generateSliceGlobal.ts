import generateGlobal from './generateGlobal'

/**
 * Generates global.ts file that imports all .global.ts files from the slice modules
 */
export default function generateSliceGlobal(slicePath: string): string {
    return generateGlobal(slicePath)
}