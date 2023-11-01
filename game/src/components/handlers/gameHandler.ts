import { Application } from 'pixi.js';
import { WorldHandler } from './worldHandler';
import { DecisionHandler } from './decisionHandler';
import { DisplayHandler } from './displayHandler';
import { DebugHandler } from './debugHandler';
import { StateHandler } from './stateHandler';

class GameHandler {
  app: Application;
  worldHandler: WorldHandler;
  decisionHandler: DecisionHandler;
  displayHandler: DisplayHandler;
  debugHandler: DebugHandler;
  stateHandler: StateHandler

  constructor() {
    this.app = new Application();
    this.decisionHandler = new DecisionHandler(this.app.stage);
    this.debugHandler = new DebugHandler(this);
    this.worldHandler = new WorldHandler();
    this.displayHandler = new DisplayHandler();
    this.stateHandler = new StateHandler(this);
  }

  init(){
    this.worldHandler.loadWorld();
    this.stateHandler.loadStates();
    this.tick();
    this.beginLoop();
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
    this.stateHandler.loadStates();
  }

  render(){
    this.displayHandler.init();
  }
}

export { GameHandler };
