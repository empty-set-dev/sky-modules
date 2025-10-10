import Console, { bright, green, reset } from './utilities/Console'

export default async function initAll(): Promise<void> {
    Console.log(`${green}${bright}Init configs${reset}`)
    await (await import('./init-configs')).default()

    Console.log(`${green}${bright}Init sky-config${reset}`)
    ;(await import('./init-sky-config')).default()

    Console.log(`${green}${bright}Init package.json${reset}`)
    await (await import('./init-package.json')).default()

    Console.log(`${green}${bright}Init ts-configs${reset}`)
    await (await import('./init-ts-configs')).default()

    Console.log(`${green}${bright}Init .gitignore${reset}`)
    ;(await import('./init-.gitignore')).default()
}
