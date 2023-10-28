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

  constructor(x: number, y: number, biome: number, stage: Container) {
    this.x = x;
    this.y = y;
    this.q = x - (y - (y & 1)) / 2;
    this.r = y;
    this.sprite = this.handleSprite(biome);

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

    closeButton.beginFill(0x900000);

    closeButton.drawCircle(40, 40, 20);

    closeButton.interactive = true;

    closeButton.on("pointerdown", () => this.handleClose());

    let text: Text = new Text("INFO HERE");

    this.infobox.addChild(text);
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
