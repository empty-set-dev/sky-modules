// * Determine if code is running on server or client side
const runsOnSide = typeof window === 'undefined' ? 'server' : 'client'
export default runsOnSide
export const runsOnServerSide = runsOnSide === 'server'
export const runsOnClientSide = runsOnSide === 'client'
