import { PageContextServer } from 'vike/types'

export async function data(pageContext: PageContextServer) {
    try {
        // Создаем URL для API роута
        const apiUrl = new URL('/api/hello', pageContext.urlOriginal).toString()
        const response = await fetch(apiUrl)

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const apiData = await response.json()
        return { apiData }
    } catch (error) {
        console.error('Failed to fetch API data:', error)
        return { apiData: { message: 'Failed to load data', location: {} } }
    }
}
