import Hexagon from './_Hexagon'

declare module 'pkgs/honeycomb-grid' {
    interface Hex {
        hexagon: Hexagon
    }
}
