import './measures'
import globalify from 'helpers/globalify'

declare global {
    interface percentsPerSecond extends Number, percentsPerSecondTypeId {}
    function percentsPerSecond(value: number): percentsPerSecond
}

class percentsPerSecondTypeId {
    private abstract: percentsPerSecondTypeId
}

globalify(measures('percentsPerSecond', []))
