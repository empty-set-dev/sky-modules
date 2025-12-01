import generateGlobal from './generateGlobal'

/**
 * Generates global/index.ts file that imports all global/ folders from the slice modules
 */
export default function generateSliceGlobal(slicePath: string): string {
    return generateGlobal(slicePath)
}