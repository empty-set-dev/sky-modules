import runsOnServerSide from './runsOnServerSide'

declare global {
    type Platform = lib.Platform
    const Platform: typeof lib.Platform

    const platform: Platform
}

namespace lib {
    export enum OS {
        UNKNOWN = 'unknown',
        NODE = 'Node',
        IOS = 'iOS',
        ANDROID = 'Android',
        MACOS = 'Mac OS',
        WINDOWS = 'Windows',
        LINUX = 'Linux',
    }

    export enum Platform {
        UNKNOWN = 'unknown',
        SERVER = 'server',
        MOBILE = 'mobile',
        DESKTOP = 'desktop',
        WEB = 'web',
    }

    export enum AppPlatformTarget {
        UNKNOWN = 'unknown',
        NODE = 'node',
        WEB = 'web',
        UNIVERSAL = 'universal',
    }

    export let platform: Platform

    if (!runsOnServerSide) {
        window.global = window
    }
}

Object.assign(global, lib)
