import { npcInterface } from '../npc/npc';

let villager: npcInterface = {
  health: 10,
  attack: 5,
  defense: 4,
  id: 0,
  range: 5,
  regen: 3,
  isPassive: false,
};

let chicken:npcInterface = {
  health: 9,
  attack: 4,
  defense: 3,
  id: 1,
  range: 5,
  regen: 0,
  isPassive: true,
}

export { villager, chicken };
