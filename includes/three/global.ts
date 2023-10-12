/// <reference types="./index.d.ts" />
import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Three: module.default })
