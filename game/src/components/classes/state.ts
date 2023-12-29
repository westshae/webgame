import axios from "axios";
import { GameHandler } from "../handlers/gameHandler";
import "dotenv/config"

class State {
  id: number;
  capitalId: number;
  controllerId:number | null;
  tileIds: number[];
  hexcode: number;
  game: GameHandler;

  farmUtil: number;
  housingUtil: number;
  mineUtil:number;
  population: number;
  food: number;
  metal: number;

  constructor(id: number, capitalId: number, controllerId: number | null, tileIds:number[], hexcode:number, game: GameHandler, farmUtil:number, housingUtil:number, mineUtil:number, population:number, food:number, metal:number) {
    this.id = id;
    this.capitalId = capitalId;
    this.controllerId = controllerId;
    this.tileIds = tileIds;
    this.hexcode = hexcode;
    this.game = game;

    this.farmUtil = farmUtil;
    this.mineUtil = mineUtil;
    this.housingUtil = housingUtil;

    this.population = population;
    this.food = food;
    this.metal = metal;
  }

  async getDecisionCount(){
    const response = await axios.get(`http://` + process.env.IP_ADDRESS + `:5000/state/getDecisionCount`, {
      params: { stateId:this.id, email:this.game.email, jwt: this.game.jwtToken },
    });

    return response.data;
  }

  async getFirstDecision(){
    const response = await axios.get(`http://` + process.env.IP_ADDRESS + `:5000/state/getDecision`, {
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
    
    const response = await axios.post(`http://` + process.env.IP_ADDRESS + `:5000/state/completeDecision`, data);
  }

}

export { State };
