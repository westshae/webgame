import { Container, Graphics, Text } from 'pixi.js';
import { Decision } from '../classes/decision';
import axios from 'axios';

class DecisionHandler {
  decisions: Decision[];
  stage: Container;
  decisionHolder: Container;


  constructor(stage:Container) {
    this.decisions = [];
    this.stage = stage;
    this.decisionHolder = new Container();

    this.loadDecisions();
    this.refreshDecisionHolder();
  }

  async loadDecisions(){
    let currentIds:number[] = [];
    for(let decision of this.decisions){
      if(!currentIds.includes(decision.id)){
        currentIds.push(decision.id);
      }
    }
    const response = await axios.get("http://localhost:5000/decision/getDecisions");
    for(let info of response.data){
      if(currentIds.includes(info.id)){
        continue;
      }
      let decision = new Decision(info.id, info.question, this.stage);
      this.decisions.push(decision);
    }
  }

  getFirstDecision():Decision|undefined{
    if(this.decisions.length == 0){
      return undefined;
    }
    const firstDecision = this.decisions.shift();
    return firstDecision;
  }

  refreshDecisionHolder(){
    this.stage.removeChild(this.decisionHolder)
    this.decisionHolder = new Container();
    let getDecisionButton = new Graphics();

    getDecisionButton.beginFill(0x9900);

    getDecisionButton.drawCircle(40, 40, 40);

    getDecisionButton.interactive = true;

    getDecisionButton.on("pointerdown", () => this.getFirstDecision()!.presentDecision());


    let text: Text = new Text("decision holder");

    this.decisionHolder.addChild(text);
    this.decisionHolder.addChild(getDecisionButton);
    this.stage.addChild(this.decisionHolder)
  }
}

export { DecisionHandler };
