import { Application } from 'pixi.js';
import { Data } from './data';
import { HUD } from './hud';
import { World } from '../world/world';
import { displayInit } from './display';

class Game {
  app: Application;
  world: World;
  data: Data;
  hud: HUD;

  constructor(worldSize: number) {
    this.app = new Application();
    this.world = new World(worldSize);
    this.data = new Data();
    this.hud = new HUD();
  }

  init() {
    displayInit(); //Initiates display
    this.hud.init();
  }

  nextTurn() {
    this.data.changeResource(5, 1, true); //Increases turn count by 1

    for(let [key, npc] of this.world.npcMap.entries()){
      if(key === undefined || npc === undefined) continue;

      if(npc.defaultValuesID !== 0 && npc.hasTurn){
        if(!npc.isPassive)npc.combatCheck();
        if(this.world.npcMap.get(key) !== undefined && npc.hasTurn) npc.randomMovement();
      }
      
      npc.handleNextTurn();
    }
  }
}

export { Game };
