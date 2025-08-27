@singleton
@singleton
@singleton
@singleton
export default class Boo {
    static readonly self = 'boo'
    static y = 42

    x = 42
}

const { boo } = singleton(Boo)

console.log(boo)
