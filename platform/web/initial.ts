import '../initial'
import '../client-definitions.d'

import '../client-definitions'
import './env.d'

import runsOnServerSide from '../runsOnServerSide'

declare let platform: Platform
platform

if (runsOnServerSide) {
    platform = Platform.NODE
} else {
    platform = Platform.WEB
}
