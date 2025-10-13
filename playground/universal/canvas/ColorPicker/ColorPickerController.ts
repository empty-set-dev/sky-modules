export interface ColorPickerControllerParameters {
    getSelectedColor: () => string | null
    setSelectedColor: (selectedColor: string) => void
}
export default class ColorPickerController {
    private __onChangeCallbacks: (() => void)[] = []

    get selectedColor(): string | null {
        return this.__getSelectedColor()
    }

    set selectedColor(color: string) {
        this.__setSelectedColor(color)
        this.__onChangeCallbacks.forEach(callback => callback())
    }

    constructor(parameters: ColorPickerControllerParameters) {
        this.__getSelectedColor = parameters.getSelectedColor
        this.__setSelectedColor = parameters.setSelectedColor
    }

    onChange(callback: () => void): () => void {
        this.__onChangeCallbacks.push(callback)

        return () => {
            const index = this.__onChangeCallbacks.indexOf(callback)

            if (index > -1) {
                this.__onChangeCallbacks.splice(index, 1)
            }
        }
    }

    private __getSelectedColor: () => string | null
    private __setSelectedColor: (selectedColor: string) => void
}
