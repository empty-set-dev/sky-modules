import './initial.scss'

import './definitions.d'
import './env.d'

import runsOnServerSide from '../runsOnServerSide'

declare let platform: Platform
platform

if (runsOnServerSide) {
    platform = Platform.NODE
} else {
    platform = Platform.UNIVERSAL
}
