import data from 'sky/platform/web/helpers/data'

const AboutPageData = data(async pageContext => {
    await pageContext.init({
        ns: [],
    })

    return {
        title: 'About',
        description: '',
    }
})

export default AboutPageData
