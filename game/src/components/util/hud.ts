import { Container, Graphics, Text } from "pixi.js";
import { game } from "../..";
import { Tile } from "../world/tile";
import { Data } from "./data";

class HUD {
  container: Container;
  bar: Graphics;
  nextButton: Graphics;
  buildButton: Graphics;
  information: Container;
  action: Container;
  tileInfo : Container;
  // height:number;
  // screenWidth:number;

  constructor() {
    this.container = new Container();
    this.bar = new Graphics();
    this.nextButton = new Graphics();
    this.buildButton = new Graphics();
    this.information = new Container();
    this.action = new Container();
    this.tileInfo = new Container();
  }

  init() {
    //Added HUD to stage, added event for resizing, draws HUD
    game.app.stage.addChild(this.container);

    //Draws, then adds event for detecting resize
    this.draw();
    window.addEventListener("resize", () => {
      this.draw();
    });

    //Adds HUD element to container
    this.container.addChild(this.bar);
    this.container.addChild(this.nextButton);
    this.container.addChild(this.buildButton);
    this.container.addChild(this.information);
    this.container.addChild(this.action);
    this.container.addChild(this.tileInfo);
  }

  draw() {
    //Draws all HUD elements
    //Sets width and height of HUD

    //Draws elements
    this.drawNextButton();
    this.drawBuildToggle();
    this.drawInformation();
  }

  displayTile(tile:Tile){
    this.tileInfo.visible = true;
    this.tileInfo.removeChildren();
    let values;
    if(tile.isEmpty)return;
    else if(tile.npc !== undefined){
      values = [
        {title:"Name" , value:tile.npc.name},
        {title:"Health", value:tile.npc.health},
        {title:"Defense", value:tile.npc.defense},
        {title:"Attack", value:tile.npc.attack},
        {title:"Range", value:tile.npc.range},
        {title:"Item 1", value:tile.npc.itemList.at(0)},
        {title:"Item 2", value:tile.npc.itemList.at(1)}
      ]
    }else if (tile.building !== undefined){
      values = [
        {title:"id", value:tile.building.id}
      ]
    }else if(tile.node !== undefined){
      values = [
        {title:"Amount", value:tile.node.amount}
      ]
    }

    if(values !== undefined){
      for (let i = 0; i < values?.length; i ++) {
        let current = values.at(i);
        if(current === undefined) return;
        if(current.value === undefined) continue;
        if(current.title === undefined) continue;
        this.makeInformationBox(current.title, current.value, i*25, false, this.tileInfo);
      }
    }
  }

  showDisplayTile(bool:boolean){
    this.tileInfo.visible = bool;
  }

  drawInformation() {
    this.information.removeChildren();
    let values = [
     { name: "level", amount: game.data.level },
     { name: "exp", amount: game.data.experience}, 
     {name:"turn", amount:game.data.turn}, 
     {name:"lumber", amount:game.data.lumber}, 
     {name:"stone", amount:game.data.stone}, 
     {name:"metal", amount:game.data.metal},
    ];

    if(this.information.children.length < 5){
      for (let i = 0; i < 6; i ++) {
        let current = values.at(i);
        if(current === undefined) return;
        this.makeInformationBox(current?.name, current?.amount, i*25, true, this.information);
      }
    }
  }

  makeInformationBox(text: string, data: any, height: number, left: boolean, container:Container) {
    let obj: Text = new Text(text + ":" + data);
    obj.y = height + 50;
    if(left){
      obj.x = 0;

    }else{
      obj.x = game.app.screen.right -200;
    }
    container.addChild(obj)
  }

  drawNextButton() {
    let height = game.app.renderer.height / 16
    //Draws next turn button of HUD
    this.nextButton = new Graphics();

    //Draws button
    this.nextButton.beginFill(0x900000);
    this.nextButton.drawStar(height / 2, height / 2, 5, height / 2);

    //Turns button into button
    this.nextButton.interactive = true;
    this.nextButton.on("pointerdown", () => game.nextTurn());
  }

  drawBuildToggle(){
    let height = game.app.renderer.height / 16

    this.buildButton = new Graphics();

    this.buildButton.beginFill(0x900000);
    this.buildButton.drawStar(game.app.renderer.width - height / 2, height / 2, 5, height / 2);

    //Turns button into button
    this.buildButton.interactive = true;
    this.buildButton.on("pointerdown", () => game.world.toggleBuildMode());
  }

  toggleActionVisible(visibility: boolean) {
    this.action.visible = visibility;
  }
}

export { HUD };
