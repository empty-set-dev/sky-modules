// import data from 'sky/platform/web/helpers/data'

import { PageContextServer } from 'vike/types'

// const HomePageData = data(async pageContext => {
//     const { t } = await pageContext.init({
//         ns: [],
//     })

//     return {
//         title: `title`,
//         description: '',
//     }
// })

// export default HomePageData

export default function getHomePageData(pageContext: PageContextServer): { title: string } {
    return {
        title: 'Home',
    }
}
