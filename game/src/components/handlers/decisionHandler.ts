import { Container, Graphics, Text } from 'pixi.js';
import { Decision } from '../classes/decision';
import axios from 'axios';

class DecisionHandler {
  decisions: Decision[];
  stage: Container;
  decisionHolder: Container;


  constructor(stage:Container) {
    this.stage = stage;

    this.loadDecisions();
  }

  async loadDecisions(){
    let currentIds = [];
    for(let decision of this.decisions){
      if(!currentIds.includes(decision.id)){
        currentIds.push(decision.id);
      }

    }
    const response = await axios.get("http://localhost:5000/decision/getDecision");
    for(let info of response.data){
      if(currentIds.includes(info.id)){
        continue;
      }
      let decision = new Decision(info.id, info.question, this.stage);
      this.decisions.push(decision);
    }
  }

  getFirstDecision():Decision{
    if(this.decisions.length == 0){
      return null;
    }
    const firstDecision = this.decisions.shift();
    return firstDecision;
  }

  setupDecisionHolder(){
    this.decisionHolder = new Container();
    let getDecisionButton = new Graphics();

    getDecisionButton.beginFill(0x900000);

    getDecisionButton.drawCircle(40, 40, 20);

    getDecisionButton.interactive = true;

    getDecisionButton.on("pointerdown", () => this.getFirstDecision().presentDecision());

    let text: Text = new Text("question text");

    this.decisionHolder.addChild(text);
    this.decisionHolder.addChild(getDecisionButton);
    this.stage.addChild(this.decisionHolder)

  }
}

export { DecisionHandler };
