/* eslint-disable no-console */
import '../'

getMayakCategories({
    groupId: null,
    fbs: true,
})
    .then((categories: unknown) => {
        console.log(categories)
    })
    .catch((err: Error) => {
        if (err.message === 'Auth') {
            console.error(err)
            return
        }
    })
