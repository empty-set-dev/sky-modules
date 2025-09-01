import './definitions.d'
import './env.d'
import runsOnServerSide from './utilities/runsOnServerSide'

console.log(runsOnServerSide)
if (!runsOnServerSide) {
    window.global = window
}
