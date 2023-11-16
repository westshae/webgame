import axios from "axios";
import { GameHandler } from "../handlers/gameHandler";

class State {
  id: number;
  capitalId: number;
  controllerId:number | null;
  tileIds: number[];
  hexcode: number;
  game: GameHandler;

  constructor(id: number, capitalId: number, controllerId: number | null, tileIds:number[], hexcode:number, game: GameHandler) {
    this.id = id;
    this.capitalId = capitalId;
    this.controllerId = controllerId;
    this.tileIds = tileIds;
    this.hexcode = hexcode;
    this.game = game;
  }

  async getDecisionCount(){
    const response = await axios.get(`http://localhost:5000/state/getDecisionCount`, {
      params: { stateId:this.id, email:this.game.email, jwt: this.game.jwtToken },
    });

    return response.data;
  }

  async getFirstDecision(){
    const response = await axios.get(`http://localhost:5000/state/getDecision`, {
      params: { stateId:this.id, email:this.game.email, jwt: this.game.jwtToken },
    });

    return response.data;
  }

  async completeDecision(stateId:number, decisionId:number, optionNumber:number, email:string, jwt:string){
    let data = {
      stateId: stateId, 
      decisionId: decisionId, 
      optionNumber:optionNumber, 
      email:email, 
      jwt:jwt
    };
    
    const response = await axios.post(`http://localhost:5000/state/completeDecision`, data);
  }

}

export { State };
