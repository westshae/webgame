import { Container, Graphics, Sprite, Text } from "pixi.js";
import { grassTexture, houseTexture, missingTexture, sandTexture, stoneTexture, waterTexture } from "../handlers/texturesHandler";

class Tile {
  recentMouseX:number | undefined;
  recentMouseY:number | undefined;
  spriteWidth: number;
  spriteHeight: number;
  gapPixels: number;


  sprite: Sprite;
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



  constructor(x: number, y: number, q: number, biome:string, housingMax:number, farmlandMax:number, stage: Container, stateId: number|null, connectedTiles: number[]) {
    this.x = x;
    this.y = y;
    this.q = q;

    this.housingMax = housingMax;
    this.farmlandMax = farmlandMax;
    this.biome = biome;

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

    if(this.stateId != null){
      let house = Sprite.from(houseTexture);

      house.width = this.spriteWidth;
      house.height = this.spriteWidth;
      house.x = this.sprite.x;
      house.y = this.sprite.y;
  
  
      this.stage.addChild(house);  
    }
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

  handleTileInfo(event: { data: { originalEvent: { clientX: number | undefined; clientY: number | undefined; }; }; }) {
    if(!(this.recentMouseX == event.data.originalEvent.clientX && this.recentMouseY == event.data.originalEvent.clientY)){
      return;
    }
    if(this.infobox != null){
      return;
    }
    this.infobox = new Container();
    this.infobox.setTransform(this.sprite.x + 50, this.sprite.y-50)
    let closeButton = new Graphics();

    let background = new Graphics();

    background.beginFill(0xFFFDD0); // Cream color
    background.drawRect(-20, -30, 350, 170);
    background.endFill();

    closeButton.beginFill(0x900000);

    closeButton.drawCircle(300, 0, 20);

    closeButton.interactive = true;

    closeButton.on("pointerdown", () => this.handleClose());
  
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

    this.infobox.addChild(background);
    this.infobox.addChild(title);
    this.infobox.addChild(coords);
    this.infobox.addChild(biome);
    this.infobox.addChild(housing);
    this.infobox.addChild(farmland);

    this.infobox.addChild(closeButton);
    this.stage.addChild(this.infobox);
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
