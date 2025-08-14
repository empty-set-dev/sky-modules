import cluster from 'cluster'

import { clearConsole } from 'sky/utilities/Console
if (cluster.isPrimary) {
    clearConsole()
}
