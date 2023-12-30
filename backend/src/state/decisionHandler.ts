import { StateEntity } from "./state.entity";
import { StateService } from "./state.service";

export class Decision {
  static options = {
    0: Decision.handleDecision0,
    1: Decision.handleDecision1
  }

  static getRandomKey() {
    const keys = Object.keys(this.options);
    const randomKey = keys[Math.floor(Math.random() * keys.length + 1) - 1];
    return parseInt(randomKey);
  }

  static async getQuestion(key:number){
    const option = Decision.options[key] ?? null;
    if(option == null){
      this.defaultDecision();
    } else {
      return await option(true, 0, 0);
    }
  }

  static async executeKey(key:number, stateService:StateService, stateEntity:StateEntity, optionNumber: number){
    const option = Decision.options[key] ?? null;
    if(option == null){
      this.defaultDecision();
    } else {
      await option(false, stateService, stateEntity, optionNumber);
    }
  }

  static async handleDecision0(wantQuestion:boolean, stateService: StateService, stateEntity:StateEntity, optionNumber: number){
    const question:string = "We have the chance to improve our infrastructure! Should we improve our farms or mines?";

    if(wantQuestion){
      return question;
    } else {
      if(optionNumber == 0){//Increase farms
        stateEntity.farmUtil += 5
      } else if (optionNumber == 1){//Increase mines
        stateEntity.mineUtil += 5
      }
      return stateEntity;
    }
  }

  static async handleDecision1(wantQuestion:boolean, stateService: StateService, stateEntity:StateEntity, optionNumber: number){
    const question:string = "We believe we have enough resources to expand our empire! Should we spend our population, food and metal on this expansion?";

    if(wantQuestion){
      return question;
    } else {
      const canAfford = stateEntity.food > 10 && stateEntity.metal > 10 && stateEntity.population > 10;
      if(optionNumber == 0 && canAfford){//Yes and can afford
        stateEntity.food -= 10
        stateEntity.metal -= 10
        stateEntity.population -= 10

        stateService.giveStateNewTile(stateEntity.id);
      } else if (optionNumber == 1 || canAfford == false){//No or can't afford
        //send notification here
      }
      return stateEntity;
    }
  }

  static defaultDecision(){
    console.info("this action key isn't existing");
  }
}