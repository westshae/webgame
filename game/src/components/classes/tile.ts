import { Container, Graphics, Sprite, Text } from "pixi.js";
import { grassTexture, sandTexture, waterTexture } from "../handlers/texturesHandler";

class Tile {
  recentMouseX:number | undefined;
  recentMouseY:number | undefined;
  x: number;
  y: number;
  q: number;
  r: number;
  sprite: Sprite;
  stage: Container;
  infobox: Container | null;
  population:number;
  farmland:number;
  farmlandUtilized:number;
  biome:number;

  constructor(x: number, y: number, population:number, farmland:number, farmlandUtilized:number, biome: number, stage: Container) {
    this.x = x;
    this.y = y;
    this.q = x - (y - (y & 1)) / 2;
    this.r = y;
    this.sprite = this.handleSprite(biome);

    this.population = population;
    this.farmland = farmland;
    this.farmlandUtilized = farmlandUtilized;
    this.biome = biome;

    this.sprite.interactive = true;
    this.sprite.on("pointerdown", (event: any) => this.handlePointerDown(event));
    this.sprite.on("pointerup", (event: any) => this.handleTileInfo(event));
    this.infobox = null;

    this.stage = stage;
    stage.addChild(this.sprite);
  }

  handleSprite(biome: number) {
    if (biome < -0.2) {
      return Sprite.from(waterTexture);
    } else if (biome < 0.1) {
      return Sprite.from(sandTexture);
    } else {
      return Sprite.from(grassTexture);
    }
  }

  getBiomeName(biome: number){
    if (biome < -0.2) {
      return "Ocean";
    } else if (biome < 0.1) {
      return "Beach";
    } else {
      return "Plains";
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
    let x: Text = new Text("X: " + this.x);
    let y: Text = new Text("Y: " + this.y);
    let biome: Text = new Text("Biome: " + this.getBiomeName(this.biome));
    let population: Text = new Text("Population: " + this.population);
    let farmland: Text = new Text("Farmland: " + this.farmland);
    let farmlandUtilization: Text = new Text("Farmland Utilization: " + this.farmlandUtilized);

    title.position.set(0, -20);
    x.position.set(0, 0);
    y.position.set(0, 20);
    biome.position.set(0, 40);
    population.position.set(0, 60);
    farmland.position.set(0, 80);
    farmlandUtilization.position.set(0, 100);

    this.infobox.addChild(background);
    this.infobox.addChild(title);
    this.infobox.addChild(x);
    this.infobox.addChild(y);
    this.infobox.addChild(biome);
    this.infobox.addChild(population);
    this.infobox.addChild(farmland);
    this.infobox.addChild(farmlandUtilization);

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
