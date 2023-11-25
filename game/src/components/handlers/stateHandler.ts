import { Container } from "pixi.js";
import { State } from "../classes/state";
import axios from "axios";
import { GameHandler } from "./gameHandler";

class StateHandler {
  states: { [id: number]: State };
  game: GameHandler;


  constructor(game:GameHandler) {
    this.game = game;
    this.states = [];
  }

  async getOwnedStates(){
    await axios.get("http://localhost:5000/state/getControlledStates", {params: {email: this.game.email, jwt: this.game.jwtToken}}).then((response) =>{
      this.states = [];
      for(let entity of response.data){
        let state = new State(entity.id, entity.capitalId, entity.controllerId, entity.tileIds, entity.hexcode, this.game, entity.farmlandCount, entity.housingCount, entity.populationCount, entity.foodCount);
        this.states[entity.id] = state;
      }
    });
  }
}

export { StateHandler };
