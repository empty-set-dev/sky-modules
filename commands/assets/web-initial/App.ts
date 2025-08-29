@singleton
export default class App {
}

foo.app = getSingleton(App)
function foo(): void {
    console.log(foo.app)
}
