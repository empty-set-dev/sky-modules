import define from './define'

export default function save<T>(value: T): string {
    return JSON.stringify(value)
}

define('sky.core.save', save)
