import cluster from 'cluster'

import { clearConsole } from 'sky/helpers/console'
if (cluster.isPrimary) {
    clearConsole()
}
