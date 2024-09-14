import globalify from 'sky/helpers/globalify'
import * as pkg from 'socket.io'
import { EventsMap } from 'socket.io/dist/typed-events'

globalify({ SocketIO: pkg })

declare global {
    namespace SocketIO {
        export const Namespace: typeof pkg.Namespace
        export const Server: typeof pkg.Server
        export const Socket: typeof pkg.Socket

        export type BroadcastOperator<
            EmitEvents extends EventsMap,
            SocketData
        > = pkg.BroadcastOperator<EmitEvents, SocketData>
        export type DisconnectReason = pkg.DisconnectReason
        export type Event = pkg.Event
        export type Namespace = pkg.Namespace
        export type RemoteSocket<EmitEvents extends EventsMap, SocketData> = pkg.RemoteSocket<
            EmitEvents,
            SocketData
        >
        export type Server = pkg.Server
        export type ServerOptions = pkg.ServerOptions
        export type Socket = pkg.Socket
    }
}
