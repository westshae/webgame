import { Tile } from "../classes/tile";
import { Container } from "pixi.js";
import axios from "axios";

class WorldHandler {
  container: Container;
  grid: Array<Array<Tile>> | undefined;

  constructor() {

    this.container = new Container();
  }

  async generateWorld(){
    axios.post("http://localhost:5000/tile/createWorld", {
      size: 32
    }).then(() =>{
      this.loadWorld();
    })
  }

  async loadWorld() {

    axios.get("http://localhost:5000/tile/getWorld").then((response) =>{
      this.grid = [];
      for(let tileInfo of response.data){
        let tile = new Tile(tileInfo.x, tileInfo.y, tileInfo.q, tileInfo.population, tileInfo.farmland, tileInfo.farmlandUtilized, tileInfo.biome, this.container, tileInfo.ownerUserId);
        console.log(tileInfo.ownerUserId);
  
        if (!this.grid[tileInfo.x]) {
          this.grid[tileInfo.x] = [];
        }
        this.grid[tileInfo.x][tileInfo.y] = tile;
      }
      this.render();  
    })

  }

  async updateWorldValues(){
    if(this.grid == undefined){
      return;
    }
    const response = await axios.get("http://localhost:5000/tile/getWorld");

    for(let tileInfo of response.data){
      let tile = this.grid[tileInfo.x][tileInfo.y];

      tile.population = tileInfo.population;
      tile.farmland = tileInfo.farmland;
      tile.farmlandUtilized = tileInfo.farmlandUtilized;
      tile.biome = tileInfo.biome;

      if (!this.grid[tileInfo.x]) {
        this.grid[tileInfo.x] = [];
      }
      this.grid[tileInfo.x][tileInfo.y] = tile;
    }

  }

  render() {
    if(this.grid == undefined){
      return;
    }
    for (let value of this.grid) {
      for (let tile of value) {
        tile.render();
      }
    }
  }
}

export { WorldHandler };
