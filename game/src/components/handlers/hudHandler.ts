import { Container, Graphics, Text } from 'pixi.js';
import { GameHandler } from './gameHandler';
import { Tile } from '../classes/tile';
import { State } from '../classes/state';

class HudHandler {
  stage: Container;
  leftContainer: Container;
  rightContainer: Container;
  game: GameHandler;


  constructor(game:GameHandler) {
    this.stage = game.app.stage;
    this.game = game;
    this.leftContainer = new Container();
    this.stage.addChild(this.leftContainer);

    this.rightContainer = new Container();
    this.stage.addChild(this.rightContainer);
  }

  loadHud(){
    this.loadRightSidebar();
    this.leftContainer.zIndex = 10;
    this.rightContainer.zIndex = 10;
    this.stage.sortChildren();
  }

  loadRightSidebar(){
    let screenWidth = this.game.app.view.width;

    this.rightContainer.x = screenWidth-200;


    let title: Text = new Text("States Owned");

    title.position.set(0, 0);

    let y = 50;

    for(let state of Object.values(this.game.stateHandler.states)){
      let button = new Graphics();
      button.beginFill(state.hexcode);
      button.drawCircle(-20, y, 20);
      button.interactive = true;
      this.rightContainer.addChild(button);

      y += 50;
    }

    this.rightContainer.addChild(title);
  }

  loadTileInfoMenu(tile:Tile){
    this.newBackground(0,0,500,600);
    this.closeButton(500);

    this.newText(0,0,"Tile Information", 500)
    this.newText(0,20,"X-Y-Q: " + tile.x + ", " + tile.y + ", " + tile.q, 500)
    this.newText(0,40,"Biome: " + tile.biome, 500)
    this.newText(0,60,"Max Housing: " + tile.housingMax, 500)
    this.newText(0,80,"Max Farmland: " + tile.farmlandMax, 500)
  }

  async loadCapitalInfoMenu(tile:Tile, stateId:number){
    this.newBackground(0,0,500,600);
    this.closeButton(500);

    this.newText(0,0,"Tile Information", 500)
    this.newText(0,20,"X-Y-Q: " + tile.x + ", " + tile.y + ", " + tile.q, 500)
    this.newText(0,40,"Biome: " + tile.biome, 500)
    this.newText(0,60,"Max Housing: " + tile.housingMax, 500)
    this.newText(0,80,"Max Farmland: " + tile.farmlandMax, 500)

    let state = this.game.stateHandler.states[stateId];

    this.newText(0,120,"Farmland: " + state.farmlandCount, 500)
    this.newText(0,140,"Housing: " + state.housingCount, 500)
    this.newText(0,160,"Food: " + state.foodCount, 500)
    this.newText(0,180,"Population: " + state.populationCount, 500)


    this.newText(0, 220, "Decision Count: " + await state.getDecisionCount(), 500);
    this.newText(0, 260, "Open a decision!", 500);

    this.newButton(220, 275, 0x900000, 20, async () => {
      this.loadDecisionInfoMenu(stateId);
    });

  }

  async loadDecisionInfoMenu(stateId:number){
    this.newBackground(0,0,500,600);
    this.closeButton(500);

    let decision = await this.game.stateHandler.states[stateId].getFirstDecision();

    this.newText(0, 60, decision.question, 500);

    for(let i = 0; i < 2; i++){
      this.newButton((220+(i*50)), 560, 0x900000, 20, () => {
        if(stateId == null || this.game.email == null || this.game.jwtToken == null){
          return;
        }  
        this.game.stateHandler.states[stateId].completeDecision(stateId, decision.id, i, this.game.email, this.game.jwtToken);
        console.log(i);
        this.handleClose();
      });
    }

  }

  newBackground(x:number, y:number, width:number, height:number){
    let background = new Graphics();

    background.beginFill(0xFFFDD0); // Cream color
    background.drawRect(x, y, width, height);
    background.endFill();

    this.leftContainer.addChild(background);
  }

  newText(x:number, y:number, text:string, maxWidth: number){
    let textObject: Text = new Text(text, { wordWrap: true, wordWrapWidth: maxWidth });
    textObject.position.set(x, y);
    this.leftContainer.addChild(textObject);
  }

  newButton(x:number, y:number, hexcode:number, size:number, onClick:Function){
    let button = new Graphics();

    button.beginFill(hexcode);

    button.drawCircle(x, y, size);

    button.interactive = true;

    button.on("pointerdown", onClick);
    this.leftContainer.addChild(button);
  }

  closeButton(x:number){
    let closeButton = new Graphics();

    closeButton.beginFill(0x900000);

    closeButton.drawCircle(x-40, 40, 20);

    closeButton.interactive = true;

    closeButton.on("pointerdown", () => this.handleClose());
    this.leftContainer.addChild(closeButton);
  }

  handleClose(){
    this.stage.removeChild(this.leftContainer);
    this.leftContainer = new Container();
    this.stage.addChild(this.leftContainer);
  }
}

export { HudHandler };
