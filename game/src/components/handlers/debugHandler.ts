import { Container, Graphics, Text } from 'pixi.js';
import { Decision } from '../classes/decision';
import axios from 'axios';
import { GameHandler } from './gameHandler';

class DebugHandler {
  stage: Container;
  container: Container;
  game: GameHandler;


  constructor(game:GameHandler) {
    this.stage = game.app.stage;
    this.game = game;
    this.container = new Container();

    this.refreshDebugHolder();
  }

  refreshDebugHolder(){
    this.stage.removeChild(this.container)
    this.container = new Container();

    let screenWidth = this.game.app.view.width;

    this.container.x = screenWidth-200;

    let startTickLoopButton = new Graphics();
    startTickLoopButton.beginFill(0x009900);
    startTickLoopButton.drawCircle(-20, 100, 20);
    startTickLoopButton.interactive = true;
    startTickLoopButton.on("pointerdown", () => this.handleTickLoop());

    let title: Text = new Text("Debug Settings");
    let startTickLoopText: Text = new Text("Start Ticks");

    title.position.set(0, 0);
    startTickLoopText.position.set(0, 35);


    this.container.addChild(title);
    this.container.addChild(startTickLoopText);

    this.container.addChild(startTickLoopButton);

    this.stage.addChild(this.container)
  }

  async handleTickLoop(){
    this.game.beginLoop();
  }
}

export { DebugHandler };
