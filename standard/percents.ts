import './measures'
import globalify from 'helpers/globalify'

declare global {
    interface percents extends Number, module.percentsTypeId {}
    function percents(value: number): percents
}

namespace module {
    export class percentsTypeId {
        private abstract: percentsTypeId
    }

    export const { percents } = measures('percents', [])
}

globalify({ percents })
