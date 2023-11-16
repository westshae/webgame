import { Container, Graphics, Text } from 'pixi.js';
import { GameHandler } from './gameHandler';

class HudHandler {
  stage: Container;
  leftContainer: Container;
  rightContainer: Container;
  game: GameHandler;


  constructor(game:GameHandler) {
    this.stage = game.app.stage;
    this.game = game;
    this.leftContainer = new Container();
    this.stage.addChild(this.leftContainer);

    this.rightContainer = new Container();
    this.stage.addChild(this.rightContainer);
  }

  loadHud(){
    this.loadLeftSidebar();
    this.loadRightSidebar();
  }

  loadRightSidebar(){

    let screenWidth = this.game.app.view.width;

    this.leftContainer.x = screenWidth-200;


    let title: Text = new Text("States Owned");

    title.position.set(0, 0);

    let y = 50;

    for(let state of Object.values(this.game.stateHandler.states)){
      let button = new Graphics();
      button.beginFill(state.hexcode);
      button.drawCircle(-20, y, 20);
      button.interactive = true;
      this.leftContainer.addChild(button);

      y += 50;
    }

    this.leftContainer.addChild(title);
  }

  loadLeftSidebar(){
    let title: Text = new Text("States Owned");

    title.position.set(0, 0);

    let y = 50;

    for(let state of Object.values(this.game.stateHandler.states)){
      let button = new Graphics();
      button.beginFill(state.hexcode);
      button.drawCircle(20, y, 20);
      button.interactive = true;
      this.rightContainer.addChild(button);

      y += 50;
    }

    this.rightContainer.addChild(title);
  }

}

export { HudHandler };
