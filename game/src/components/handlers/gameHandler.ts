import { Application } from 'pixi.js';
import { WorldHandler } from './worldHandler';
import { DisplayHandler } from './displayHandler';
import { HudHandler } from './hudHandler';
import { StateHandler } from './stateHandler';
import { Viewport } from 'pixi-viewport';

class GameHandler {
  app: Application;
  worldHandler: WorldHandler;
  displayHandler: DisplayHandler;
  hudHandler: HudHandler;
  stateHandler: StateHandler
  email:string | null;
  jwtToken:string | null;

  constructor(email:string | null, jwtToken:string | null) {
    this.app = new Application();
    this.hudHandler = new HudHandler(this);
    this.worldHandler = new WorldHandler(this);
    this.displayHandler = new DisplayHandler();
    this.stateHandler = new StateHandler(this);
    this.email = email;
    this.jwtToken = jwtToken;
  }

  async init(){
    if(this.jwtToken == null || this.email == null){
      return;
    }
    // window.history.replaceState({}, document.title, window.location.pathname);
    await this.worldHandler.render();
    await this.tick();
    await this.beginLoop();
    await this.hudHandler.loadHud();
  }

  beginLoop(){
    setInterval(async() => {
      await this.tick();
    }, 3000);  
  }

  async tick(){
    await this.stateHandler.getOwnedStates();
    await this.worldHandler.render();
    await this.hudHandler.updateStateInfoBox();
    await this.hudHandler.sendMayorNotification("Fun fact, click on my face to get a new decision!");
  }

  render(){
    this.displayHandler.init();
  }
}

export { GameHandler };
