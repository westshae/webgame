import { Container, Graphics, Text } from "pixi.js";
import axios from "axios";

class Decision {
  id: number;
  question: string;
  stage: Container;
  decision: Container | undefined;

  constructor(id:number, question:string, stage:Container) {
    this.stage = stage;
    this.id = id;
    this.question = question;
  }

  async presentDecision() {
    console.log(this.id + ":" + this.question);
    //Draws next turn button of HUD
    this.decision = new Container();
    let yesButton = new Graphics();
    let noButton = new Graphics();


    //Draws button
    yesButton.beginFill(0x900000);
    noButton.beginFill(0x900000);

    yesButton.drawCircle(40, 40, 20);
    noButton.drawCircle(80, 40, 20);

    //Turns button into button
    yesButton.interactive = true;
    noButton.interactive = true;

    yesButton.on("pointerdown", () => this.handleFirstOption());
    noButton.on("pointerdown", () => this.handleSecondOption());

    let text: Text = new Text("question text");

    this.decision.addChild(text);
    this.decision.addChild(yesButton);
    this.decision.addChild(noButton);
    this.stage.addChild(this.decision)
  }

  handleFirstOption(){
    if(this.decision == undefined){
      return;
    }
    this.stage.removeChild(this.decision);

    axios.post("http://localhost:5000/decision/finishDecision", {
      questionId: 2,
      option: 1
    });


    console.log("first");
  }

  handleSecondOption(){
    if(this.decision == undefined){
      return;
    }

    this.stage.removeChild(this.decision);

    axios.post("http://localhost:5000/decision/finishDecision", {
      questionId: 2,
      option: 2
    });


    console.log("second");

  }
}

export { Decision };
