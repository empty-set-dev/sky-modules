declare module 'troika-three-text' {
    export type Text = lib.TextView
    export const Text: lib.TextView
}

declare namespace lib {
    interface TextView {
        new (): TextView

        text: string
        fontSize: number
        position: Vector3
        color: number

        sync(): void
        dispose(): void
    }
}
