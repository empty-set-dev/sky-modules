import './measures'

declare global {
    interface percents extends Number, module.percentsTypeId {}
    var percents: (value: number) => percents
}

namespace module {
    export class percentsTypeId {
        private abstract: percentsTypeId
    }

    export const { percents } = measures('percents', [])
}

Object.assign(global, module)
