import { Container, Sprite } from "pixi.js";
import { grassTexture, sandTexture, waterTexture } from "../util/textures";

class Tile {
  x: number;
  y: number;
  q: number;
  r: number;
  sprite: Sprite;

  constructor(x: number, y: number, biome: number, container: Container) {
    this.x = x;
    this.y = y;
    this.q = x - (y - (y&1)) / 2;
    this.r = y;
    this.sprite = this.handleSprite(biome);

    this.sprite.interactive = true;

    container.addChild(this.sprite);
  }

  handleSprite(biome: number) {
    if (biome < -0.2) {
      return Sprite.from(waterTexture);
    } else if(biome < 0.1) {
      return Sprite.from(sandTexture);
    }else{
      return Sprite.from(grassTexture)
    }
  }
}

export { Tile };
