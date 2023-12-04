import { StateEntity } from "./state.entity";

export class Decision {
  static options = {
    0: Decision.handleDecision0,
    1: Decision.handleDecision1,
  }

  static getRandomKey() {
    const keys = Object.keys(this.options);
    const randomKey = keys[Math.round(Math.random() * keys.length)];
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

  static async executeKey(key:number, stateEntity:StateEntity, optionNumber: number){
    const option = Decision.options[key] ?? null;
    if(option == null){
      this.defaultDecision();
    } else {
      await option(false, stateEntity, optionNumber);
    }
  }

  static async handleDecision0(wantQuestion:boolean, stateEntity:StateEntity, optionNumber: number){
    const question:string = "Our lord, some of our people say we need more housing, but many complain we don't produce enough food. Should we focus on 1. Housing or 2. Farmland?";

    if(wantQuestion){
      return question;
    } else {
      if(optionNumber == 0){//Increase housing
        stateEntity.housingWeight += 10;
        stateEntity.farmlandWeight -= 10;
      } else if (optionNumber == 1){//Increase farmland
        stateEntity.housingWeight -= 10;
        stateEntity.farmlandWeight += 10;
      }
      return stateEntity;
    }
  }

  static async handleDecision1(wantQuestion:boolean, stateEntity:StateEntity, optionNumber: number){
    const question:string = "Our lord, some of our people say we need more workers, but many complain we don't claim enough land for our people. Should we focus on 1. Food or 2. Land?";

    if(wantQuestion){
      return question;
    } else {
      if(optionNumber == 0){//Increase food
        stateEntity.foodWeight += 10;
        stateEntity.landWeight -= 10;
      } else if (optionNumber == 1){//Increase land
        stateEntity.foodWeight -= 10;
        stateEntity.landWeight += 10;
      }
    }
  }

  static defaultDecision(){
    console.info("this action key isn't existing");
  }
}