import { warning, greetings } from './scenes.js'
import { Game } from './game.js'

const script = [warning, greetings]


var game = new Game();
game.startGame(script)

export { game }
