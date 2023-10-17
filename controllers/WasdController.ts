export default class WasdController extends Effect {
    constructor(link: Effects) {
        super(link)

        new EventListener(this, 'keydown', ev => {
            console.log(ev)
            link['x'] = 0
            link['y'] = 0
        })
    }
}
