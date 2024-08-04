import globalify from 'sky/helpers/globalify'
import * as lib from 'socket.io'
import { EventsMap } from 'socket.io/dist/typed-events'

globalify({ SocketIO: lib })

declare global {
    namespace SocketIO {
        export const Namespace: typeof lib.Namespace
        export const Server: typeof lib.Server
        export const Socket: typeof lib.Socket

        export type BroadcastOperator<
            EmitEvents extends EventsMap,
            SocketData
        > = lib.BroadcastOperator<EmitEvents, SocketData>
        export type DisconnectReason = lib.DisconnectReason
        export type Event = lib.Event
        export type Namespace = lib.Namespace
        export type RemoteSocket<EmitEvents extends EventsMap, SocketData> = lib.RemoteSocket<
            EmitEvents,
            SocketData
        >
        export type Server = lib.Server
        export type ServerOptions = lib.ServerOptions
        export type Socket = lib.Socket
    }
}
