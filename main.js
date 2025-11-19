import './style.css'
import { Game } from './src/game.js'

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
});
