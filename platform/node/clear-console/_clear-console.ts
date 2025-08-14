import cluster from 'cluster'

import Console from 'sky/utilities/Console'

if (cluster.isPrimary) {
    Console.clear()
}
