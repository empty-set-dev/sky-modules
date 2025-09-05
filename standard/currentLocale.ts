import runsOnServerSide from 'sky/platform/runsOnServerSide'

export let currentLocale: string

if (runsOnServerSide) {
    const env = process.env
    let serverLocale = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES

    if (serverLocale != null) {
        serverLocale = serverLocale.split('_')[0]
    }

    if (serverLocale) {
        currentLocale = serverLocale
    }
}

currentLocale ??= Intl.DateTimeFormat().resolvedOptions().locale
