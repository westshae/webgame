import { Container, Graphics, Sprite, Text } from "pixi.js";
import { grassTexture, sandTexture, waterTexture } from "../util/textures";

class Tile {
  x: number;
  y: number;
  q: number;
  r: number;
  sprite: Sprite;
  stage: Container;
  infobox: Container;

  constructor(x: number, y: number, biome: number, stage: Container) {
    this.x = x;
    this.y = y;
    this.q = x - (y - (y & 1)) / 2;
    this.r = y;
    this.sprite = this.handleSprite(biome);

    this.sprite.interactive = true;
    this.sprite.on("pointerdown", () => this.handleTileInfo());

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

  handleTileInfo() {
    console.log(this.x + ":" + this.y);
    this.infobox = new Container();
    this.infobox.setTransform(this.sprite.x + 50, this.sprite.y-50)
    let closeButton = new Graphics();
    // let noButton = new Graphics();

    //Draws button
    closeButton.beginFill(0x900000);
    // noButton.beginFill(0x900000);

    closeButton.drawCircle(40, 40, 20);
    // noButton.drawCircle(80, 40, 20);

    //Turns button into button
    closeButton.interactive = true;
    // noButton.interactive = true;

    closeButton.on("pointerdown", () => this.handleClose());
    // noButton.on("pointerdown", () => this.handleSecondOption());

    let text: Text = new Text("INFO HERE");

    this.infobox.addChild(text);
    this.infobox.addChild(text);
    this.infobox.addChild(text);
    this.infobox.addChild(text);
    this.infobox.addChild(text);
    this.infobox.addChild(closeButton);
    // this.infobox.addChild(noButton);
    this.stage.addChild(this.infobox);
  }

  handleClose(){
    this.stage.removeChild(this.infobox);
  }
}

export { Tile };
