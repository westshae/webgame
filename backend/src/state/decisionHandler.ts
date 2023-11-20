export class Decision {
  static options = {
    0: Decision.handleAction0,
    1: Decision.handleAction1
  }

  static getRandomKey() {
    const keys = Object.keys(this.options);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return parseInt(randomKey);
  }

  static getOption(key:number){
    const option = Decision.options[key] ?? null;
    if(option == null){
      return Decision.defaultAction();
    } else {
      return option;
    }
  }

  static handleAction0(wantQuestion:boolean){
    const question:string = "Question String is here like mad ting";

    if(wantQuestion){
      return question;
    } else {
      return () => {
        console.log("reasdasdasd");
      }
    }
  }

  static handleAction1(wantQuestion:boolean){
    const question:string = "Question String is here like mad ting";

    if(wantQuestion){
      return question;
    } else {
      return () => {
        console.log("reasdasdasd");
      }
    }
  }

  static defaultAction(){
    console.info("this action key isn't existing");
  }

}