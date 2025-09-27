import { Title } from '@solidjs/meta'

export default function About() {
    console.log(JSON.stringify(<Title>About</Title>))
    return (
        <main>
            <Title>About</Title>
            <h1>About</h1>
        </main>
    )
}
