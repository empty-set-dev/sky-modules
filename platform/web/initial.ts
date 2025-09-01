import './definitions.d'
import './env.d'
import runsOnServerSide from './utilities/runsOnServerSide'

if (!runsOnServerSide) {
    window.global = window
}
