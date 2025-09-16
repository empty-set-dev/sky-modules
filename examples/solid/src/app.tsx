import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'

import Box from '../../../design/Box'
import Link from '../../../design/components/Link'
import CloneElementDemo from './clone-element-example'
import './app.css'

export default function App() {
    return (
        <Router
            root={props => (
                <MetaProvider>
                    <Title>SolidStart - Basic</Title>
                    <a href="/">Index</a>
                    <a href="/about">About</a>
                    <Box>Box</Box>
                    <Link>Link</Link>
                    <CloneElementDemo />
                    <Suspense>{props.children}</Suspense>
                </MetaProvider>
            )}
        >
            <FileRoutes />
        </Router>
    )
}
