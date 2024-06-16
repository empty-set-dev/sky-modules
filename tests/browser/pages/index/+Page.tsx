import { Counter } from './Counter'

import { PageLayout } from '@/layouts/PageLayout'

export function Page(): ReactNode {
    return (
        <PageLayout>
            <h1>Welcome</h1>
            This page is:
            <ul>
                <li>Rendered to HTML.</li>
                <li>
                    Interactive. <Counter />
                </li>
            </ul>
        </PageLayout>
    )
}
