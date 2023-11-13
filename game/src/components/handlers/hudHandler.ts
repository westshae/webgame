import { Container, Graphics, Text } from 'pixi.js';
import { Decision } from '../classes/decision';
import axios from 'axios';
import { GameHandler } from './gameHandler';
import { State } from '../classes/state';

class HudHandler {
  stage: Container;
  container: Container;
  game: GameHandler;


  constructor(game:GameHandler) {
    this.stage = game.app.stage;
    this.game = game;
    this.container = new Container();

    // this.refreshHolder();
  }

  refreshHolder(){
    this.stage.removeChild(this.container)
    this.container = new Container();

    let screenWidth = this.game.app.view.width;

    this.container.x = screenWidth-200;


    let title: Text = new Text("States Owned");

    title.position.set(0, 0);

    let y = 50;

    for(let state of Object.values(this.game.stateHandler.states)){
      let button = new Graphics();
      button.beginFill(state.hexcode);
      button.drawCircle(-20, y, 20);
      button.interactive = true;
      // startTickLoopButton.on("pointerdown", () => this.handleTickLoop());
      this.container.addChild(button);

      y += 50;
    }


    this.container.addChild(title);

    this.stage.addChild(this.container)
  }

  async getOwnedStates(){
  }
}

export { HudHandler };
