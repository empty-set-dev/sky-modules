export default class WasdController extends Effect {
    constructor(link: Effects) {
        super(link)

        new EventListener(this, 'keydown', ev => {
            console.log(ev)
        })
    }
}
