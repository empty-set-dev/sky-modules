import '../../imports'
import data from 'sky/platform/web/data'

const HomePageData = data(async pageContext => {
    await pageContext.init({
        ns: [],
    })

    return {
        title: 'Fresnel',
        description: '',
    }
})

export default HomePageData
