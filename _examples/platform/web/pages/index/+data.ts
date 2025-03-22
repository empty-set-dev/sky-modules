import data from 'sky/platform/web/helpers/data'
import getStore from 'sky/platform/web/helpers/getStore'
import runsOnServerSide from 'sky/platform/web/utilities/runsOnServerSide'

import { CounterStore } from '#/stores/CounterStore'

const HomePageData = data(async pageContext => {
    const { t } = await pageContext.init({
        ns: [],
    })

    const counter = getStore(pageContext, CounterStore)

    if (runsOnServerSide) {
        counter.count = 10
    }

    return {
        title: t`title`,
        description: '',
    }
})

export default HomePageData
