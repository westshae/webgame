import { Container, Sprite } from "pixi.js";
import { grassTexture, sandTexture, waterTexture } from "../util/textures";
import axios from "axios";

class Decision {
  id: number;
  question: string;

  constructor() {
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
  }
}

export { Decision };
