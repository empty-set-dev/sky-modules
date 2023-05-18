import axios, * as local from 'axios'
import 'base/globalify'
globalify({ axios, ...local })
