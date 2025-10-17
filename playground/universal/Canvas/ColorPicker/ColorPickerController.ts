export interface ColorPickerControllerParameters {
    getSelectedColor: () => string | null
    setSelectedColor: (selectedColor: string) => void
}
export default class ColorPickerController {
    get selectedColor(): string | null {
        return this.__getSelectedColor()
    }

    set selectedColor(color: string) {
        this.__setSelectedColor(color)
        this.__onChangeCallbacks.forEach(callback => callback())
    }

    private __onChangeCallbacks: (() => void)[] = []
    private __getSelectedColor: () => string | null
    private __setSelectedColor: (selectedColor: string) => void

    constructor(parameters: ColorPickerControllerParameters) {
        this.__getSelectedColor = parameters.getSelectedColor
        this.__setSelectedColor = parameters.setSelectedColor
    }

    onChange(callback: () => void): () => void {
        this.__onChangeCallbacks.push(callback)
        return () => {
            this.__onChangeCallbacks.splice(this.__onChangeCallbacks.indexOf(callback), 1)
        }
    }
}
