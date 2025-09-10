import { PageContextServer } from 'vike/types'

export default function getHomePageData(pageContext: PageContextServer): { title: string } {
    return {
        title: 'Home',
    }
}
