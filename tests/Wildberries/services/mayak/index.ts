import 'tests/includes'

import './mayak-categories'

import * as local from './defaultly'

declare global {
    type MayakCategory = local.default
}
