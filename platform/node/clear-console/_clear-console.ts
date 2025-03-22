import cluster from 'cluster'

import { clearConsole } from 'sky/utilities/console'
if (cluster.isPrimary) {
    clearConsole()
}
