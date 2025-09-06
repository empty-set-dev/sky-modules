import data from 'sky/platform/web/helpers/data'

const HomePageData = data(async pageContext => {
    const { t } = await pageContext.init({
        ns: [],
    })

    return {
        title: `title`,
        description: '',
    }
})

export default HomePageData
