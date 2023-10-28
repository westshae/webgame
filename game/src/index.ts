import { GameHandler } from './components/handlers/gameHandler';

const game = new GameHandler();

const main = async () => {
  game.render();

  game.init();
};

main();

export { game };
