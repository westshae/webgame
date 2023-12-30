import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { GameHandler } from './gameHandler';
import { Tile } from '../classes/tile';
import { State } from '../classes/state';
import { mayorTexture } from './texturesHandler';
import TweenMax from 'gsap';

class HudHandler {
  stage: Container;
  decisionContainer: Container;
  stateContainer: Container;
  mayorContainer: Container;
  game: GameHandler;

  stateName: Text;
  stateFood: Text;
  stateMetal: Text;
  stateHousing: Text;
  stateFarm: Text;
  stateMine: Text;
  statePopulation: Text;


  constructor(game:GameHandler) {
    this.stage = game.app.stage;
    this.game = game;
    this.decisionContainer = new Container();
    this.stage.addChild(this.decisionContainer);

    this.stateContainer = new Container();
    this.stage.addChild(this.stateContainer);

    this.mayorContainer = new Container();
    this.stage.addChild(this.mayorContainer);

    this.stateName = new Text("Placeholder Text");
    this.stateFood = new Text("Placeholder Text");
    this.stateMetal = new Text("Placeholder Text");
    this.stateHousing = new Text("Placeholder Text");
    this.stateFarm = new Text("Placeholder Text");
    this.stateMine = new Text("Placeholder Text");
    this.statePopulation = new Text("Placeholder Text");
  }

  loadHud(){
    this.loadStateInfoBox();
    this.loadMayorInfoBox();

    this.decisionContainer.zIndex = 10;
    this.stateContainer.zIndex = 10;
    this.mayorContainer.zIndex = 10;
    this.stage.sortChildren();
  }

  updateStateInfoBox(){
    let state = Object.values(this.game.stateHandler.states)[0];

    this.stateName.text = "WIP Name"
    this.stateHousing.text = "" + state.housingUtil + " Housing"
    this.stateFarm.text = "" + state.farmUtil + " Farms"
    this.stateMine.text = "" + state.mineUtil + " Mines"
    this.statePopulation.text = "" + state.population + " Population"
    this.stateFood.text = "" + state.food + " Food"
    this.stateMetal.text = "" + state.metal + " Metal"
  }

  sendMayorNotification(text: string){
    let maxWidth = 400;
    
    let notificationContainer = new Container();

    let textObject: Text = new Text(text, { wordWrap: true, wordWrapWidth: maxWidth });
    textObject.position.set(25,225);

    let background = new Graphics();

    background.beginFill(0xFFFDD0, 0.8); // Cream color

    background.drawRect(20, 225, 420, 60);
    background.endFill();

    notificationContainer.addChild(background);
    notificationContainer.addChild(textObject);

    this.mayorContainer.addChild(notificationContainer);

    TweenMax.to(notificationContainer.position, 10, { y: this.game.app.view.height-100, ease: "linear", onComplete: this.removeText.bind(this, notificationContainer) });
  }

  removeText(object:any) {
    TweenMax.to(object, 1, { alpha: 0 , onComplete: () =>{
      this.mayorContainer.removeChild(object);
      object.destroy();
    }});

  }

  loadMayorInfoBox(){
    let mayor = Sprite.from(mayorTexture);
    mayor.width = 200;
    mayor.height = 200;

    mayor.interactive = true;

    mayor.on("pointerdown", ()=>{
      this.loadDecisionInfoMenu(Object.values(this.game.stateHandler.states)[0].id);
    });

    this.mayorContainer.addChild(mayor);
  }

  loadStateInfoBox(){
    let screenWidth = this.game.app.view.width;

    this.stateContainer.x = screenWidth-250;

    let state = Object.values(this.game.stateHandler.states)[0];

    this.stateName.text = "WIP Name"
    this.stateHousing.text = "" + state.housingUtil + " Housing"
    this.stateFarm.text = "" + state.farmUtil + " Farm"
    this.stateMine.text = "" + state.mineUtil + " Mines";
    this.statePopulation.text = "" + state.population + " Population"
    this.stateFood.text = "" + state.food + " Food"
    this.stateMetal.text = "" + state.metal + " Metal"

    let list = [this.stateName, this.stateHousing, this.stateFarm, this.stateMine, this.statePopulation, this.stateFood, this.stateMetal];
    let y = 20;

    for(let i of list){
      i.position.set(0,y);

      let background = new Graphics();

      background.beginFill(0xFFFDD0); // Cream color
      background.drawRect(0, y, 200, 30);
      background.endFill();
  
      this.stateContainer.addChild(background);

      this.stateContainer.addChild(i);
  
      y +=40;
    }
  }

  loadTileInfoMenu(tile:Tile){
    this.sendMayorNotification("TileTest" + tile.biome)
  }

  async loadDecisionInfoMenu(stateId:number){
    let decision = await this.game.stateHandler.states[stateId].getFirstDecision();
    if(Object.keys(decision).length === 0){
      this.sendMayorNotification("There are no decisions available right now. Please wait and try again");
      return;
    }

    this.decisionContainer.position.set(this.game.app.view.width-500, this.game.app.view.height-600)
    this.newBackground(0,0,500,600);
    this.closeButton(500);


    this.newText(0, 60, decision.question, 500);

    for(let i = 0; i < 2; i++){
      this.newButton((220+(i*50)), 560, 0x900000, 20, () => {
        if(stateId == null || this.game.email == null || this.game.jwtToken == null){
          return;
        }  
        this.game.stateHandler.states[stateId].completeDecision(stateId, decision.id, i, this.game.email, this.game.jwtToken);
        this.handleClose();
      });
    }

  }

  newBackground(x:number, y:number, width:number, height:number){
    let background = new Graphics();

    background.beginFill(0xFFFDD0); // Cream color
    background.drawRect(x, y, width, height);
    background.endFill();

    this.decisionContainer.addChild(background);
  }

  newText(x:number, y:number, text:string, maxWidth: number){
    let textObject: Text = new Text(text, { wordWrap: true, wordWrapWidth: maxWidth });
    textObject.position.set(x, y);
    this.decisionContainer.addChild(textObject);
  }

  newButton(x:number, y:number, hexcode:number, size:number, onClick:Function){
    let button = new Graphics();

    button.beginFill(hexcode);

    button.drawCircle(x, y, size);

    button.interactive = true;

    button.on("pointerdown", onClick);
    this.decisionContainer.addChild(button);
  }

  closeButton(x:number){
    let closeButton = new Graphics();

    closeButton.beginFill(0x900000);

    closeButton.drawCircle(x-40, 40, 20);

    closeButton.interactive = true;

    closeButton.on("pointerdown", () => this.handleClose());
    this.decisionContainer.addChild(closeButton);
  }

  handleClose(){
    this.stage.removeChild(this.decisionContainer);
    this.decisionContainer = new Container();
    this.stage.addChild(this.decisionContainer);
  }
}

export { HudHandler };
