import data from 'sky/@platform/web/data'

const HomePageData = data(async pageContext => {
    const { t } = await pageContext.init({
        ns: [],
    })

    return {
        title: t`title`,
        description: '',
    }
})

export default HomePageData
