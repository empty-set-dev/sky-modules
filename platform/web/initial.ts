import './definitions'
import './env'

import runsOnServerSide from './utilities/runsOnServerSide'

if (!runsOnServerSide) {
    window.global = window
}
