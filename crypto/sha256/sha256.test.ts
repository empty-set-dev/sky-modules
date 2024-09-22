import sha256 from './_sha256'

test('sha256', () => {
    expect(sha256('Hello, world!')).toBe(
        '315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3'
    )
})
