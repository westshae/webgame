import { Container, Graphics, Text } from "pixi.js";
import { grassTexture, sandTexture, waterTexture } from "../util/textures";
import axios from "axios";

class Decision {
  id: number;
  question: string;
  stage: Container;
  decision: Container;

  constructor(stage:Container) {
    this.stage = stage;
    this.getDecision();
    setInterval(() => {
      this.presentDecision();
    }, 15000);

  }

  async getDecision(){
    const response = await axios.get("http://localhost:5000/decision/getDecision");
    this.id = response.data.id;
    this.question = response.data.question;
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
    this.stage.removeChild(this.decision);

    axios.post("http://localhost:5000/decision/finishDecision", {
      questionId: 2,
      option: 1
    });


    console.log("first");
  }

  handleSecondOption(){
    this.stage.removeChild(this.decision);

    axios.post("http://localhost:5000/decision/finishDecision", {
      questionId: 2,
      option: 2
    });


    console.log("second");

  }
}

export { Decision };
