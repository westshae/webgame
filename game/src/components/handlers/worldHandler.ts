import { Tile } from "../classes/tile";
import { Container } from "pixi.js";
import axios from "axios";
import { GameHandler } from "./gameHandler";

class WorldHandler {
  container: Container;
  game:GameHandler;
  tiles: { [id: number]: Tile };

  constructor(game:GameHandler) {
    this.game = game;
    this.container = new Container();
    this.tiles = [];
  }

  async loadWorld(){
    
    await axios.get("http://localhost:5000/state/getStateTiles", {params:{email: this.game.email, jwt: this.game.jwtToken}}).then((response) =>{
      this.tiles = [];
      for(let entity of response.data){
        let tile = new Tile(entity.x, entity.y, entity.q, entity.biome, entity.housingMax, entity.farmlandMax, this.container, entity.stateId, entity.connectedTiles, entity.hexcode, false, this.game);
        this.tiles[entity.id] = tile;
      }
      this.render();  
    })
    this.game.stateHandler.renderStates();
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
