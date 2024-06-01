window.global = window

new EventSource('/esbuild').addEventListener('change', e => {
    const { added, removed, updated } = JSON.parse(e.data)

    if (!added.length && !removed.length && updated.length === 1) {
        const links = document.getElementsByTagName('link')
        for (let i = 0; i < links.length; ++i) {
            const link = links.item(i)
            const url = new URL(link.href)

            if (url.host === location.host && url.pathname === updated[0]) {
                const next = link.cloneNode() as HTMLLinkElement
                next.href = updated[0] + '?' + Math.random().toString(36).slice(2)
                next.onload = (): void => link.remove()
                link.parentNode.insertBefore(next, link.nextSibling)
                return
            }
        }
    }

    location.reload()
})
