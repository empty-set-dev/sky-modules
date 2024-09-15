import pkg from 'universal-cookie'

let result = pkg

if ((result as never as { default: pkg }).default) {
    result = (result as never as { default: pkg }).default as never
}

export default result
