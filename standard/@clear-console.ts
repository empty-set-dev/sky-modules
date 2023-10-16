export {}

const clusterImport = 'cluster'
const cluster = (await import(`${clusterImport}`).catch(() => ({
    isPrimary: false,
}))) as never as { isPrimary: boolean }

if (cluster.isPrimary) {
    // eslint-disable-next-line no-console
    console.clear()
}
