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
    this.decisionHandler = new DecisionHandler(this.app.stage);
    this.worldHandler = new WorldHandler();
    this.displayHandler = new DisplayHandler();

  }

  init(){
    this.worldHandler.generateWorld();
    this.worldHandler.loadWorld();
    this.tick();

    setInterval(() => {
      this.tick();
    }, 15000);  
  }

  tick(){
    this.worldHandler.updateWorldValues();
    this.decisionHandler.loadDecisions();
    this.decisionHandler.refreshDecisionHolder();
  }

  render(){
    this.displayHandler.init();
  }
}

export { GameHandler };
