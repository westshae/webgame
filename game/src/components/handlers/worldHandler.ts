import { Tile } from "../classes/tile";
import { Container } from "pixi.js";
import axios from "axios";

class WorldHandler {
  container: Container;
  tiles: { [id: number]: Tile };

  constructor() {
    this.container = new Container();
    this.tiles = [];
  }

  async loadWorld() {
    axios.get("http://localhost:5000/tile/getWorld").then((response) =>{
      this.tiles = [];
      for(let entity of response.data){
        let tile = new Tile(entity.x, entity.y, entity.q, entity.biome, entity.housingMax, entity.farmlandMax, this.container, entity.stateId, entity.connectedTiles, entity.colourId);
        this.tiles[entity.id] = tile;
      }
      this.render();  
    })

  }

  async updateWorldValues(){
    const response = await axios.get("http://localhost:5000/tile/getWorld");

    for(let entity of response.data){
      let tile = this.tiles[entity.id];

      tile.housingMax = entity.housingMax;
      tile.farmlandMax = entity.farmlandMax;
      tile.biome = entity.biome;
      this.tiles[entity.id] = tile;
    }
  }

  setTile(id:number, tile:Tile){
    this.tiles[id] = tile;
  }

  getTileFromId(id:number){
    return this.tiles[id];
  }

  render() {
    for(let tile of Object.values(this.tiles)){
      tile.render();
    }
  }
}

export { WorldHandler };
