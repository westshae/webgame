import { Application } from 'pixi.js';
import { World } from '../world/world';
import { displayInit } from './display';
import { Decision } from '../decision/decision';

class Game {
  app: Application;
  world: World;

  constructor(worldSize: number) {
    this.app = new Application();
    this.world = new World(worldSize);
  }

  init() {
    displayInit(); //Initiates display
    let decision = new Decision(this.app.stage);
  }
}

export { Game };
