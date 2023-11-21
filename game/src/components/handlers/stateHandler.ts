import { Container } from "pixi.js";
import { State } from "../classes/state";
import axios from "axios";
import { GameHandler } from "./gameHandler";

class StateHandler {
  container: Container;
  states: { [id: number]: State };
  game: GameHandler;


  constructor(game:GameHandler) {
    this.container = new Container();
    this.game = game;
    this.states = [];
  }

  async getOwnedStates(){
    await axios.get("http://localhost:5000/state/getControlledStates", {params: {email: this.game.email, jwt: this.game.jwtToken}}).then((response) =>{

      for(let entity of response.data){
        let state = new State(entity.id, entity.capitalId, entity.controllerId, entity.tileIds, entity.hexcode, this.game);
        this.states[entity.id] = state;
      }
    })
    this.renderStates();
  }

  renderStates(){
    for(let state of Object.values(this.states)){
      let tileIds = state.tileIds;
      for(let tileId of tileIds){
        let tile = this.game.worldHandler.getTileFromId(tileId);
        if(tile == null){
          continue;
        }
        if(state.capitalId == tileId){
          tile.isCapital = true;
        }
        tile.stateId = state.id;
        tile.hexcode = state.hexcode;
        this.game.worldHandler.setTile(tileId, tile);
        tile.render();
      }
    }
  }
}

export { StateHandler };
