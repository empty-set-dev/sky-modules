export {}

const clusterImport = 'cluster'
const processImport = 'process'
const cluster = (await import(`${clusterImport}`).catch(() => ({
    isPrimary: false,
}))) as never as { isPrimary: boolean }
const process = (await import(`${processImport}`).catch(() => null)) as never

if (cluster.isPrimary) {
    process.write('\033[2J');
}
