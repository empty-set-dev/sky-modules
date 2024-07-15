import Nav from 'sky/docs/Nav'

import skyConfig from '../sky.config'

export default (props: object): ReactNode => <Nav {...props} title={skyConfig.title} />
