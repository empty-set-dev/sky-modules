/**
 * Configuration for scrollbar rendering
 */
export interface ScrollbarConfig {
    width: number
    margin: number
    minThumbHeight: number
    trackColor: string
    thumbColor: string
}

/**
 * Default scrollbar configuration
 */
export const defaultScrollbarConfig: ScrollbarConfig = {
    width: 12,
    margin: 2,
    minThumbHeight: 30,
    trackColor: 'rgba(255, 255, 255, 0.15)',
    thumbColor: 'rgba(255, 255, 255, 0.5)',
}
