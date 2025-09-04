import runsOnServerSide from './runsOnServerSide'

declare global {
    type Arch = lib.Arch
    const Arch: typeof lib.Arch
    type Platform = lib.Platform
    const Platform: typeof lib.Platform
    type OperationSystem = lib.OperationSystem
    const OperationSystem: typeof lib.OperationSystem
    type AppPlatformTarget = lib.AppPlatformTarget
    const AppPlatformTarget: typeof lib.AppPlatformTarget

    const arch: Arch
    const operationSystem: OperationSystem
    const platform: Platform
    const appPlatformTarget: AppPlatformTarget
}

namespace lib {
    export enum Arch {
        UNKNOWN = 'unknown',
        ARM64 = 'Arm64',
        X64 = 'x64',
    }
    export enum Platform {
        UNKNOWN = 'unknown',
        NODE = 'node',
        MOBILE = 'mobile',
        DESKTOP = 'desktop',
        WEB = 'web',
    }
    export enum OperationSystem {
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

    export let arch = Arch.UNKNOWN
    export let platform = Platform.UNKNOWN
    export let operationSystem = OperationSystem.UNKNOWN
    export let appPlatformTarget = AppPlatformTarget.UNKNOWN

    if (!runsOnServerSide) {
        window.global = window
    }
}

Object.assign(global, lib)
Object.assign(global, lib)
