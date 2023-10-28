import { Tile } from "../classes/tile";
import { Container } from "pixi.js";
import axios from "axios";

class WorldHandler {
  container: Container;
  grid: Array<Array<Tile>>;
  screenSize: number;
  spriteWidth: number;
  spriteHeight: number;

  constructor() {
    this.spriteWidth = Math.sqrt(3) * 50;
    this.spriteHeight = 2 * 50;

    this.container = new Container();
  }

  async generateWorld(){
    await axios.post("http://localhost:5000/tile/createWorld", {
      size: 8
    });
    this.loadWorld();
  }

  async loadWorld() {
    this.grid = [];

    const response = await axios.get("http://localhost:5000/tile/getWorld");

    for(let tileInfo of response.data){
      let tile = new Tile(tileInfo.x, tileInfo.y, tileInfo.biome, this.container);
      console.log(tileInfo.population);

      if (!this.grid[tileInfo.x]) {
        this.grid[tileInfo.x] = [];
      }
      this.grid[tileInfo.x][tileInfo.y] = tile;
    }
    this.render();
  }

  render() {
    for (let value of this.grid) {
      for (let tile of value) {
        tile.sprite.width = this.spriteWidth;
        tile.sprite.height = this.spriteHeight;

        let yindex = tile.y - 1;
        let heightOffset =
          (this.spriteHeight / 2) * (Math.round(yindex / 2) - 2);

        if (yindex % 2 == 0) {
          //If even line
          tile.sprite.x = tile.x * this.spriteWidth + this.spriteWidth / 2;
          tile.sprite.y = yindex * this.spriteHeight - heightOffset;
        } else {
          //If odd line
          tile.sprite.x = tile.x * this.spriteWidth;
          tile.sprite.y =
            yindex * this.spriteHeight + this.spriteHeight / 4 - heightOffset;
        }
      }
    }
  }
}

export { WorldHandler };
