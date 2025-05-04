import data from 'sky/platform/web/helpers/data'

export default data(async pageContext => {
    await pageContext.init({
        ns: [],
        theme: 'dark',
    })

    return {
        title: 'sky/components/UI',
        description: '',
    }
})
