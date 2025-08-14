import cluster from 'cluster'

import { clearConsole } from 'sky/utilities/Console2e
if (cluster.isPrimary) {
    clearConsole()
}
