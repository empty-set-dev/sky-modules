import './measures'
import globalify from 'helpers/globalify'

declare global {
    interface percentsPerSecond extends Number, module.percentsPerSecondTypeId {}
    function percentsPerSecond(value: number): percentsPerSecond
}

namespace module {
    export class percentsPerSecondTypeId {
        private abstract: percentsPerSecondTypeId
    }

    export const { percents } = measures('percentsPerSecond', [])
}

globalify({ percentsPerSecond })
