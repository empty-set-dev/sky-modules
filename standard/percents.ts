import './measures'
import globalify from 'helpers/globalify'

declare global {
    interface percents extends Number, percentsTypeId {}
    function percents(value: number): percents
}

export class percentsTypeId {
    private abstract: percentsTypeId
}

globalify(measures('percents', []))
