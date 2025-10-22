import Internal from './Internal'

export default function reaction(reaction: () => void): void {
    Internal.reactions.push(reaction)
    reaction()
    Internal.reactions.pop()
}
