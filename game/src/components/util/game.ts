import { Application } from 'pixi.js';
import { World } from '../world/world';
import { displayInit } from './display';

class Game {
  app: Application;
  world: World;

  constructor(worldSize: number) {
    this.app = new Application();
    this.world = new World(worldSize);
  }

  init() {
    displayInit(); //Initiates display
  }
}

export { Game };
