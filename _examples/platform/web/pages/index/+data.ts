import data from 'sky/platform/web/data'
import getStore from 'sky/platform/web/helpers/getStore'

import { CounterStore } from '#/stores/CounterStore'

const HomePageData = data(async pageContext => {
    const { t } = await pageContext.init({
        ns: [],
    })

    const counter = getStore(pageContext, CounterStore)

    return {
        title: t`title`,
        description: '',
    }
})

export default HomePageData
