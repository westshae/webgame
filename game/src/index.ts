import { sword } from './components/defaults/items';
import { chicken, villager } from './components/defaults/npc';
import { Game } from './components/util/game';
import { townCenter } from './components/defaults/builds';
import { chest, tree } from './components/defaults/node';

const game = new Game(64);

const main = async () => {
  game.init();
  game.world.generateRandom();

  //Adds villagers, names bob/joe, at coords 4:4 and 3:3 then rendersthe world
  game.world.addNPC(10, 10, villager, 'Bob');
  game.world.addNPC(4, 4, villager, 'Joe');
  game.world.addNPC(6,6,chicken, "CHICKEN")
  game.world.addBuilding(5, 5, townCenter);
  game.world.npcMap.get(1)?.addItem(sword);
  game.world.npcMap.get(1)?.removeItem(sword);

  game.world.addNode(6, 6, tree, 10);
  game.world.addNode(2, 2, chest, 1);
  game.world.render();
};

main();

export { game };
