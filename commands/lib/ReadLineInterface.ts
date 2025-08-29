import { stdin, stdout } from 'process'
import readline from 'readline'

export default class ReadLineInterface extends readline.Interface {
    constructor() {
        super({
            input: stdin,
            output: stdout,
        })
    }

    askQuestion(question: string): Promise<null | string> {
        return new Promise(resolve => {
            this.question(question, answer => {
                if (answer == '') {
                    resolve(null)
                }

                resolve(answer)
            })
        })
    }
}
