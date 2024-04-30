import cluster from 'cluster'

if (cluster.isPrimary) {
    // eslint-disable-next-line no-console
    console.clear()
}
