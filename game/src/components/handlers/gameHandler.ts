import { Application } from 'pixi.js';
import { WorldHandler } from './worldHandler';
import { DecisionHandler } from './decisionHandler';
import { DisplayHandler } from './displayHandler';

class GameHandler {
  app: Application;
  worldHandler: WorldHandler;
  decisionHandler: DecisionHandler;
  displayHandler: DisplayHandler;

  constructor() {
    this.app = new Application();
    this.worldHandler = new WorldHandler();
    this.decisionHandler = new DecisionHandler(this.app.stage);
    this.displayHandler = new DisplayHandler();

  }

  init(){
    this.worldHandler.generateWorld();

    setInterval(() => {
      this.tick();
    }, 15000);  
  }

  tick(){
    this.decisionHandler.loadDecisions();
    this.worldHandler.loadWorld();
  }

  render(){
    this.displayHandler.init();
  }
}

export { GameHandler };
