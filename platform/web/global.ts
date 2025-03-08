import './definitions.d'
import './env.d'
import runsOnServerSide from './runsOnServerSide'

if (!runsOnServerSide) {
    window.global = window
}
