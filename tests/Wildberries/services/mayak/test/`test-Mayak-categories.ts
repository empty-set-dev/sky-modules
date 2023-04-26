import Mayak from '../categories'

/* eslint-disable no-console */
Mayak.getCategories({
    groupId: null,
    fbs: true,
}).then((categories: unknown) => {
    console.log(categories)
})
