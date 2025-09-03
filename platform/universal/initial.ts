import './initial.scss'

import './definitions.d'
import './env.d'

import runsOnServerSide from '../runsOnServerSide'

declare let platform: Platform
declare let os: Platform
declare let appPlatformTarget: Platform
platform
os
appPlatformTarget

if (runsOnServerSide) {
    platform = Platform.NODE
    // os = await import()
    // os =
} else {
    // platform = Platform.UNIVERSAL
}
