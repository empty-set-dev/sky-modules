export interface CaptureUIResult {
    onTouchStart(): void
    onTouchMove(): void
    onTouchEnd(): void
    onMouseDown(): void
    onMouseMove(): void
    onMouseUp(): void
    onClick(): void
}
export default function captureUI(effect: Effect | EffectTree): CaptureUIResult {
    const root = effect instanceof Effect ? effect.root : effect

    return {
        onTouchStart(): void {
            root.isPointerEventCaptured = true
        },
        onTouchMove(): void {
            root.isPointerEventCaptured = true
        },
        onTouchEnd(): void {
            root.isPointerEventCaptured = true
        },
        onMouseDown(): void {
            root.isPointerEventCaptured = true
        },
        onMouseMove(): void {
            root.isPointerEventCaptured = true
        },
        onMouseUp(): void {
            root.isPointerEventCaptured = true
        },
        onClick(): void {
            root.isPointerEventCaptured = true
        },
    }
}
