import Hexagon from './_Hexagon'

declare module 'honeycomb-grid' {
    interface Hex {
        hexagon: Hexagon
    }
}
