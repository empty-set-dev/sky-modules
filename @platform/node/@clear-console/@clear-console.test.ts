// eslint-disable-next-line no-console
console.clear = jest.fn()

import 'sky/@platform/node/@clear-console'

it('clear console', () => {
    // eslint-disable-next-line no-console
    expect(console.clear).toHaveBeenCalled()
})
