import globalify from 'sky/utilities/globalify'

declare global {
    namespace colors {
        function shade(color: string, percent: number): string
        function lighten(color: string, percent: number): string
        function darken(color: string, percent: number): string
        function component2hex(c: number): string
        function rgb2hex(r: number, g: number, b: number): string
        function hex2rgb(color: string): [number, number, number]
    }
}

namespace module {
    export function shade(color: string, percent: number): string {
        let R = parseInt(color.substring(1, 3), 16)
        let G = parseInt(color.substring(3, 5), 16)
        let B = parseInt(color.substring(5, 7), 16)
        R *= (100 + percent) / 100
        G *= (100 + percent) / 100
        B *= (100 + percent) / 100
        R = R < 255 ? R : 255
        G = G < 255 ? G : 255
        B = B < 255 ? B : 255
        R = Math.round(R)
        G = Math.round(G)
        B = Math.round(B)
        const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16)
        const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16)
        const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16)
        return '#' + RR + GG + BB
    }

    export function rgb2hsl(r: number, g: number, b: number): [number, number, number] {
        r /= 255
        g /= 255
        b /= 255

        const cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin

        let h = 0,
            s = 0,
            l = 0

        if (delta == 0) {
            h = 0
        } else if (cmax == r) {
            h = ((g - b) / delta) % 6
        } else if (cmax == g) {
            h = (b - r) / delta + 2
        } else {
            h = (r - g) / delta + 4
        }

        h = Math.round(h * 60)

        if (h < 0) {
            h += 360
        }

        l = (cmax + cmin) / 2

        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

        s = +(s * 100).toFixed(1)
        l = +(l * 100).toFixed(1)

        return [h, s, l]
    }

    export function hsl2hex(h: number, s: number, l: number): string {
        l /= 100
        const a = (s * Math.min(l, 1 - l)) / 100
        const f = (n: number): string => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, '0') // convert to Hex and prefix "0" if needed
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }

    export function hex2hsl(color: string): [number, number, number] {
        return rgb2hsl(...hex2rgb(color))
    }

    export function lighten(color: string, percent: number): string {
        const hsl = hex2hsl(color)
        const [h, s] = hsl
        let [, , l] = hsl
        l = Math.minmax(0, 100, l + percent)
        return hsl2hex(h, s, l)
    }

    export function darken(color: string, percent: number): string {
        return lighten(color, -percent)
    }

    export function component2hex(c: number): string {
        const hex = c.toString(16)
        return hex.length == 1 ? '0' + hex : hex
    }

    export function rgb2hex(r: number, g: number, b: number): string {
        return '#' + component2hex(r) + component2hex(g) + component2hex(b)
    }

    export function hex2rgb(color: string): [number, number, number] {
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        return [r, g, b]
    }
}

globalify({ colors: module })
