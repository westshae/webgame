import { GameHandler } from './components/handlers/gameHandler';

const game = new GameHandler();

const main = async () => {
  game.init();
  game.render();
};

main();

export { game };
