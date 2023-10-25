import { Game } from './components/util/game';

const game = new Game(64);

const main = async () => {
  game.init();
  
  game.world.render();
};

main();

export { game };
