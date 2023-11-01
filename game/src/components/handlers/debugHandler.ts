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

    let setPlayer1Button = new Graphics();
    setPlayer1Button.beginFill(0x000099);
    setPlayer1Button.drawCircle(-20, 150, 20);
    setPlayer1Button.interactive = true;
    setPlayer1Button.on("pointerdown", () => this.handleSetPlayer1());

    let setPlayer2Button = new Graphics();
    setPlayer2Button.beginFill(0x000000);
    setPlayer2Button.drawCircle(-20, 200, 20);
    setPlayer2Button.interactive = true;
    setPlayer2Button.on("pointerdown", () => this.handleSetPlayer2());

    let title: Text = new Text("Debug Settings");
    let startTickLoopText: Text = new Text("Start Ticks");
    let setPlayer1Text: Text = new Text("Set Player 1");
    let setPlayer2Text: Text = new Text("Set Player 2");

    title.position.set(0, 0);
    startTickLoopText.position.set(0, 35);
    setPlayer1Text.position.set(0, 85);
    setPlayer2Text.position.set(0, 135);


    this.container.addChild(title);
    this.container.addChild(startTickLoopText);
    this.container.addChild(setPlayer1Text);
    this.container.addChild(setPlayer2Text);


    this.container.addChild(startTickLoopButton);
    this.container.addChild(setPlayer1Button);
    this.container.addChild(setPlayer2Button);

    this.stage.addChild(this.container)
  }

  async handleTickLoop(){
    this.game.beginLoop();
  }

  handleSetPlayer1(){
    this.game.userHandler.userId = 1;
    this.game.userHandler.initUser(this.game.userHandler.userId);
  }

  handleSetPlayer2(){
    this.game.userHandler.userId = 2;
    this.game.userHandler.initUser(this.game.userHandler.userId);
  }

}

export { DebugHandler };
