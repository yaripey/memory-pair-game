import { warning, greetings } from './scenes.js'
import { game } from './game.js'

const script = [warning, greetings]

game.startGame(script);

export { game };
