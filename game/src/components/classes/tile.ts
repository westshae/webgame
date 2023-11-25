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

  housingMax: number;
  farmlandMax: number;
  hexcode:number;
  isCapital:boolean;



  constructor(x: number, y: number, q: number, biome:string, housingMax:number, farmlandMax:number, stateId: number|null, hexcode: number, isCapital:boolean, game: GameHandler) {
    this.x = x;
    this.y = y;
    this.q = q;

    this.housingMax = housingMax;
    this.farmlandMax = farmlandMax;
    this.biome = biome;
    this.hexcode = hexcode;
    this.isCapital = isCapital;

    this.stateId = stateId;

    this.sprite = this.handleSprite(biome);

    this.spriteWidth = Math.sqrt(3) * 50;
    this.spriteHeight = 2 * 50;
    this.gapPixels = this.spriteWidth/20;


    this.sprite.interactive = true;
    this.sprite.on("pointerdown", (event: any) => this.handlePointerDown(event));
    this.sprite.on("pointerup", (event: any) => this.handleWhichMenuType(event));

    this.infobox = null;

    this.game = game;
    this.stage = (this.game.app.stage.getChildByName("viewport") as Container).getChildByName("world") as Container;
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

    let spriteName = this.x + ":" + this.y + ":" + this.q + ":" + "tile";
    let potentialTileSprite = this.stage.getChildByName(spriteName);
    if(potentialTileSprite != null){
      this.sprite.name = spriteName;
      potentialTileSprite = this.sprite;
    } else {
      this.sprite.name = spriteName;

      this.stage.addChild(this.sprite);

    }

    if(this.isCapital){
      let house = Sprite.from(houseTexture);

      house.zIndex = 10

      house.width = this.spriteWidth;
      house.height = this.spriteHeight;
      house.x = this.sprite.x;
      house.y = this.sprite.y;
      

      let houseName = this.x + ":" + this.y + ":" + this.q + ":" + "house";
      let potentialHouseSprite = this.stage.getChildByName(houseName);

      if(potentialHouseSprite != null) {
        house.name = houseName;
        potentialHouseSprite = house;
      } else {
        if(this.stateId != null){
          let state = this.game.stateHandler.states[this.stateId];
          if(state != undefined){
            house.tint = this.hexcode;
          }
        }
        house.name = houseName;
        this.stage.addChild(house);  
      }
    }

    if(this.stateId != null && this.hexcode != null){
      let selector = Sprite.from(selectorTexture);

      selector.tint = this.hexcode;

      selector.width = this.spriteWidth;
      selector.height = this.spriteHeight;
      selector.x = this.sprite.x;
      selector.y = this.sprite.y;

      let selectorName = this.x + ":" + this.y + ":" + this.q + ":" + "selector";
      let potentialSelectorSprite = this.stage.getChildByName(selectorName);

      if(potentialSelectorSprite != null) {
        selector.name = selectorName;
        potentialSelectorSprite = selector;
      } else {
        selector.name = selectorName;
        this.stage.addChild(selector);  
      }
    }

    this.stage.sortChildren();
  }

  newSprite(){

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

  handleWhichMenuType(event: { data: { originalEvent: { clientX: number | undefined; clientY: number | undefined; }; }; }){
    if(!(this.recentMouseX == event.data.originalEvent.clientX && this.recentMouseY == event.data.originalEvent.clientY)){
      return;
    }

    if(this.stateId != null && this.hexcode != null){
      this.game.hudHandler.loadTileInfoMenu(this);
    }
    if(this.isCapital && this.stateId != null){
      this.game.hudHandler.loadCapitalInfoMenu(this, this.stateId);
    } else {
      this.game.hudHandler.loadTileInfoMenu(this);
    }
  }
}

export { Tile };
