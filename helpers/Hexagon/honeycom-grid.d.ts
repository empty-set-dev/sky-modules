import Hexagon from './__Hexagon'

declare module 'pkgs/honeycomb-grid' {
    interface Hex {
        hexagon: Hexagon
    }
}
