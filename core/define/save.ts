import define from './define'

define('sky.core.save', save)
export default function save<T>(value: T): string {
    return JSON.stringify(value)
}
