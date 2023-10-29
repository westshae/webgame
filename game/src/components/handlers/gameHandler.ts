import { Application } from 'pixi.js';
import { WorldHandler } from './worldHandler';
import { DecisionHandler } from './decisionHandler';
import { DisplayHandler } from './displayHandler';
import { DebugHandler } from './debugHandler';
import { UserHandler } from './userHandler';

class GameHandler {
  app: Application;
  worldHandler: WorldHandler;
  decisionHandler: DecisionHandler;
  displayHandler: DisplayHandler;
  debugHandler: DebugHandler;
  userID: number;
  userHandler: UserHandler;

  constructor() {
    this.app = new Application();
    this.decisionHandler = new DecisionHandler(this.app.stage);
    this.debugHandler = new DebugHandler(this);
    this.worldHandler = new WorldHandler();
    this.displayHandler = new DisplayHandler();
    this.userHandler = new UserHandler();
    this.userID = 1;
    this.userHandler.doesUserExist(this.userID);
  }

  init(){
    this.worldHandler.loadWorld();
    this.tick();
  }

  beginLoop(){
    setInterval(() => {
      this.tick();
    }, 15000);  
  }

  tick(){
    this.worldHandler.updateWorldValues();
    this.decisionHandler.loadDecisions();
    this.decisionHandler.refreshDecisionHolder();
    this.debugHandler.refreshDebugHolder();
  }

  render(){
    this.displayHandler.init();
  }
}

export { GameHandler };
