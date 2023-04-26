import '../'

/* eslint-disable no-console */
getMayakCategories({
    groupId: null,
    fbs: true,
}).then((categories: unknown) => {
    console.log(categories)
})
