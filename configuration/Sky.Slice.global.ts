export {}

declare global {
    namespace Sky {
        interface BaseOfSlice {
            modules: string[]
        }
        interface SliceDescription extends BaseOfSlice {}
        interface SliceParameters extends BaseOfSlice {}
        type Slice = string[]
    }
}
