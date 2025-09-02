import runsOnServerSide from './runsOnServerSide'
declare global {
    type Platform = lib.Platform
    const Platform: typeof lib.Platform
    type OS = lib.OS
    const OS: typeof lib.OS
    type AppPlatformTarget = lib.AppPlatformTarget
    const AppPlatformTarget: typeof lib.AppPlatformTarget

    const os: OS
    const platform: Platform
    const appPlatformTarget: AppPlatformTarget
}

namespace lib {
    export enum Platform {
        UNKNOWN = 'unknown',
        NODE = 'NODE',
        MOBILE = 'mobile',
        DESKTOP = 'desktop',
        WEB = 'web',
    }
    export enum OS {
        UNKNOWN = 'unknown',
        IOS = 'iOS',
        ANDROID = 'Android',
        MACOS = 'Mac OS',
        WINDOWS = 'Windows',
        LINUX = 'Linux',
    }
    export enum AppPlatformTarget {
        UNKNOWN = 'unknown',
        NODE = 'node',
        WEB = 'web',
        UNIVERSAL = 'universal',
    }

    export let os: OS
    export let platform: Platform
    export let appPlatformTarget: AppPlatformTarget

    if (!runsOnServerSide) {
        window.global = window
    }
}

Object.assign(global, lib)
