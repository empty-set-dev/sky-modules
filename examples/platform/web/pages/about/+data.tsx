import '#/imports'

// import data from 'sky/platform/web/helpers/data'

export default async function data(): Promise<string> {
    await idle((2).asSeconds)
    return '123'
}

// const AboutPageData = data(async pageContext => {
//     await pageContext.init({
//         ns: [],
//     })

//     await idle((2).asSeconds)

//     return {
//         title: 'About',
//         description: '',
//     }
// })

// export default AboutPageData
