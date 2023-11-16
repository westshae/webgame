import { Container, Graphics, Sprite, Text, filters } from "pixi.js";
import { grassTexture, houseTexture, missingTexture, sandTexture, selectorTexture, stoneTexture, waterTexture } from "../handlers/texturesHandler";
import { GameHandler } from "../handlers/gameHandler";

class Tile {
  recentMouseX:number | undefined;
  recentMouseY:number | undefined;
  spriteWidth: number;
  spriteHeight: number;
  gapPixels: number;


  sprite: Sprite;
  game: GameHandler;
  stage: Container;
  infobox: Container | null;

  x: number;
  y: number;
  q: number;
  stateId:number|null;
  biome:string;

  connectedTiles: number[];
  housingMax: number;
  farmlandMax: number;
  hexcode:number;
  isCapital:boolean;



  constructor(x: number, y: number, q: number, biome:string, housingMax:number, farmlandMax:number, stage: Container, stateId: number|null, connectedTiles: number[], hexcode: number, isCapital:boolean, game: GameHandler) {
    this.x = x;
    this.y = y;
    this.q = q;

    this.housingMax = housingMax;
    this.farmlandMax = farmlandMax;
    this.biome = biome;
    this.hexcode = hexcode;
    this.isCapital = isCapital;

    this.stateId = stateId;
    this.connectedTiles = connectedTiles;

    this.sprite = this.handleSprite(biome);

    this.spriteWidth = Math.sqrt(3) * 50;
    this.spriteHeight = 2 * 50;
    this.gapPixels = this.spriteWidth/20;


    this.sprite.interactive = true;
    this.sprite.on("pointerdown", (event: any) => this.handlePointerDown(event));
    this.sprite.on("pointerup", (event: any) => this.handleTileInfo(event));
    this.infobox = null;

    this.game = game;
    this.stage = stage;
    stage.addChild(this.sprite);
  }

  render(){
    this.sprite.width = this.spriteWidth;
    this.sprite.height = this.spriteHeight;

    let yindex = this.y - 1;
    let heightOffset =
      (this.spriteHeight / 2) * (Math.round(yindex / 2) - 2);

    if (yindex % 2 == 0) {
      //If even line
      this.sprite.x = this.x * this.spriteWidth + this.spriteWidth / 2 + (this.x * this.gapPixels) + this.gapPixels/2;
      this.sprite.y = yindex * this.spriteHeight - heightOffset + (yindex * this.gapPixels); 
    } else {
      //If odd line
      this.sprite.x = this.x * this.spriteWidth + (this.x * this.gapPixels);
      this.sprite.y =
        yindex * this.spriteHeight + this.spriteHeight / 4 - heightOffset + (yindex * this.gapPixels);
    }

    if(this.stateId != null && this.hexcode != null){
      let sprite = Sprite.from(selectorTexture);
      sprite.tint = this.hexcode;

      sprite.width = this.spriteWidth;
      sprite.height = this.spriteHeight;
      sprite.x = this.sprite.x;
      sprite.y = this.sprite.y;

      sprite.on("pointerdown", (event: any) => this.handlePointerDown(event));
      sprite.on("pointerup", (event: any) => this.handleTileInfo(event));
  
      this.stage.addChild(sprite);
    }

    if(this.isCapital){
      let house = Sprite.from(houseTexture);

      house.on("pointerdown", (event: any) => this.handlePointerDown(event));
      house.on("pointerup", (event: any) => this.handleTileInfo(event));
      house.zIndex = 10

      house.width = this.spriteWidth;
      house.height = this.spriteHeight;
      house.x = this.sprite.x;
      house.y = this.sprite.y;
  
  
      this.stage.addChild(house);  
    }

    this.stage.sortChildren();

  }

  handleSprite(biome: string) {
    switch (biome){
      case "Water":
        return Sprite.from(waterTexture);
      case "Sand":
        return Sprite.from(sandTexture);
      case "Grass":
        return Sprite.from(grassTexture);
      case "Stone":
        return Sprite.from(stoneTexture);
      default:
        return Sprite.from(missingTexture);
    }
  }

  handlePointerDown(event: { data: { originalEvent: { clientX: number | undefined; clientY: number | undefined; }; }; }){
    this.recentMouseX = event.data.originalEvent.clientX;
    this.recentMouseY = event.data.originalEvent.clientY;
  }

  async handleTileInfo(event: { data: { originalEvent: { clientX: number | undefined; clientY: number | undefined; }; }; }) {
    if(!(this.recentMouseX == event.data.originalEvent.clientX && this.recentMouseY == event.data.originalEvent.clientY)){
      return;
    }
    if(this.infobox != null){
      return;
    }

    this.resetInfobox();
    this.createBackground();

    if(this.isCapital){
      await this.createCapitalInfobox();
    } else {
      this.createTileInfobox();
    }

    this.createCloseButton();
  }

  resetInfobox(){
    this.infobox = new Container();
    this.infobox.zIndex = 10;
    this.infobox.setTransform(this.sprite.x + 50, this.sprite.y-50)
    this.stage.addChild(this.infobox);
  }

  createBackground(){
    if(this.infobox == null){
      return;
    }
    let background = new Graphics();

    background.beginFill(0xFFFDD0); // Cream color
    background.drawRect(-20, -30, 350, 170);
    background.endFill();

    this.infobox.addChild(background);
  }

  createCloseButton(){
    if(this.infobox == null){
      return;
    }
    let closeButton = new Graphics();

    closeButton.beginFill(0x900000);

    closeButton.drawCircle(300, 0, 20);

    closeButton.interactive = true;

    closeButton.on("pointerdown", () => this.handleClose());
    this.infobox.addChild(closeButton);

  }

  async createCapitalInfobox(){
    if(this.infobox == null || this.stateId == null){
      return;
    }

    let decisionCount: Text = new Text("Decision Count: " + await this.game.stateHandler.states[this.stateId].getDecisionCount());
    decisionCount.position.set(0, 80);
    this.infobox.addChild(decisionCount);

    let getDecisionButton = new Graphics();

    getDecisionButton.beginFill(0x900000);

    getDecisionButton.drawCircle(0, 40, 20);

    getDecisionButton.interactive = true;

    getDecisionButton.on("pointerdown", async () => {
      if(this.stateId == null || this.game.email == null || this.game.jwtToken == null){
        return;
      }
      let decision = await this.game.stateHandler.states[this.stateId].getFirstDecision()
      console.log(decision);
      let complete = await this.game.stateHandler.states[this.stateId].completeDecision(this.stateId, decision.id, 1, this.game.email, this.game.jwtToken);
      //TODO create decision box
      this.createDecisionInfobox();
    });
    this.infobox.addChild(getDecisionButton);
  }

  async createDecisionInfobox(){
    if(this.stateId == null || this.infobox == null){
      return;
    }
    this.handleClose();
    this.resetInfobox();
    this.createBackground();

    let decision = await this.game.stateHandler.states[this.stateId].getFirstDecision();

    let decisionText: Text = new Text(decision.question);
    decisionText.position.set(0, -10);
    this.infobox.addChild(decisionText);

    for(let i = 0; i < 2; i++){
      let button = new Graphics();
      button.beginFill(0x900000);

      button.drawCircle(i * 50, 120, 20);
  
      button.interactive = true;
  
      button.on("pointerdown", () => {
        if(this.stateId == null || this.game.email == null || this.game.jwtToken == null){
          return;
        }  
        this.game.stateHandler.states[this.stateId].completeDecision(this.stateId, decision.id, i, this.game.email, this.game.jwtToken);
        this.handleClose();
      });
      this.infobox.addChild(button);
  
    }

    this.createCloseButton();
  }

  createTileInfobox(){
    if(this.infobox == null){
      return;
    }
    let title: Text = new Text("Tile Information");
    let coords: Text = new Text("X-Y-Q: " + this.x + "-" + this.y + "-" + this.q);
    let biome: Text = new Text("Biome: " + this.biome);
    let housing: Text = new Text("Max Housing: " + this.housingMax);
    let farmland: Text = new Text("Max Farmland: " + this.farmlandMax);


    title.position.set(0, -20);
    coords.position.set(0, 0);
    biome.position.set(0, 20);
    housing.position.set(0, 40);
    farmland.position.set(0, 60);

    this.infobox.addChild(title);
    this.infobox.addChild(coords);
    this.infobox.addChild(biome);
    this.infobox.addChild(housing);
    this.infobox.addChild(farmland);

  }

  handleClose(){
    if(this.infobox == null){
      return;
    }
    this.stage.removeChild(this.infobox);
    this.infobox = null;
  }

}

export { Tile };
