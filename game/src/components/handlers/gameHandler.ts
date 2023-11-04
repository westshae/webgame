import { Application } from 'pixi.js';
import { WorldHandler } from './worldHandler';
import { DisplayHandler } from './displayHandler';
import { DebugHandler } from './debugHandler';
import { StateHandler } from './stateHandler';

class GameHandler {
  app: Application;
  worldHandler: WorldHandler;
  displayHandler: DisplayHandler;
  debugHandler: DebugHandler;
  stateHandler: StateHandler
  email:string | null;
  jwtToken:string | null;

  constructor(email:string | null, jwtToken:string | null) {
    this.app = new Application();
    this.debugHandler = new DebugHandler(this);
    this.worldHandler = new WorldHandler(this);
    this.displayHandler = new DisplayHandler();
    this.stateHandler = new StateHandler(this);
    this.email = email;
    this.jwtToken = jwtToken;
  }

  init(){
    if(this.jwtToken == null || this.email == null){
      return;
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    this.worldHandler.loadWorld().then(()=>{
      this.stateHandler.loadStates();
      this.tick();
      this.beginLoop();  
    })
  }

  beginLoop(){
    setInterval(() => {
      this.tick();
    }, 3000);  
  }

  tick(){
    this.worldHandler.updateWorldValues();
    this.debugHandler.refreshDebugHolder();
    this.stateHandler.loadStates();
  }

  render(){
    this.displayHandler.init();
  }
}

export { GameHandler };
