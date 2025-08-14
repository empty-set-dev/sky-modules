import argon2, { verify } from 'pkgs/argon2'

try {
    const hash = await argon2.hash('password')
    Console.log(hash)
    Console.log(await verify(hash, 'password'))
} catch (err) {
    errorConsole(err)
}
