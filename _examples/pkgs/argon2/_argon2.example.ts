import argon2, { verify } from 'pkgs/argon2'

try {
    const hash = await argon2.hash('password')
    logConsole(hash)
    logConsole(await verify(hash, 'password'))
} catch (err) {
    errorConsole(err)
}
