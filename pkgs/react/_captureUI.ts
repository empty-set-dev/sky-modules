export interface CaptureUIResult {
    onTouchStart(): void
    onTouchMove(): void
    onTouchEnd(): void
    onMouseDown(): void
    onMouseMove(): void
    onMouseUp(): void
    onClick(): void
}
export default function captureUI(effect: Effect | EffectsRoot): CaptureUIResult {
    const root = effect instanceof Effect ? effect.root : effect

    return {
        onTouchStart(): void {
            root.isUICaptured = true
        },
        onTouchMove(): void {
            root.isUICaptured = true
        },
        onTouchEnd(): void {
            root.isUICaptured = true
        },
        onMouseDown(): void {
            root.isUICaptured = true
        },
        onMouseMove(): void {
            root.isUICaptured = true
        },
        onMouseUp(): void {
            root.isUICaptured = true
        },
        onClick(): void {
            root.isUICaptured = true
        },
    }
}
