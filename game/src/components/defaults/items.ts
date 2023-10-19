import { Sprite } from 'pixi.js';
import { itemInterface } from '../npc/items';
import { missingTexture } from '../util/textures';


const sword: itemInterface = {
  id: 0,
  name: 'Sword',
  sprite: Sprite.from(missingTexture),
  buffList: [{statID: 0, amount: 10 }],
};

const bearTrap: itemInterface = {
  id: 1,
  name: 'BearTrap',
  sprite: Sprite.from(missingTexture),
  buffList: [{statID: 0, amount: 2 }],
};

const pigHelmet: itemInterface = {
  id: 2,
  name: 'pigHelmet',
  sprite: Sprite.from(missingTexture),
  buffList: [{statID: 0, amount: 2 }],
};

const polkaPants: itemInterface = {
  id: 3,
  name: 'polkaPants',
  sprite: Sprite.from(missingTexture),
  buffList: [{statID: 0, amount: 2 }],
};

const greatAxe: itemInterface = {
  id: 2,
  name: 'greatAxe',
  sprite: Sprite.from(missingTexture),
  buffList: [{statID: 0, amount: 2 }],
};

const longBow: itemInterface = {
  id: 2,
  name: 'longBow',
  sprite: Sprite.from(missingTexture),
  buffList: [{statID: 0, amount: 2 }],
};


const allItemsMap = new Map();
allItemsMap.set(sword.id, sword);
allItemsMap.set(bearTrap.id, bearTrap);

export { sword, bearTrap, allItemsMap};