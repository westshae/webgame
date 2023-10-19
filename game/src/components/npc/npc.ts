import { Sprite } from "pixi.js";
import { game } from "../..";
import { buffInterface, itemInterface, Items } from "./items";
import { animalsTexture, missingTexture, villagerTexture } from "../util/textures";
import { Tile } from "../world/tile";

let recentID = 0;

interface npcInterface {
  health: number;
  attack: number;
  defense: number;
  range:number;
  regen:number;
  id: number;
  items?: Array<Items>;
  isPassive:boolean;
}
class NPC {
  id: number; //ID for NPC, same as npcMap key
  name: string; //Name of NPC
  defaultValuesID: number; //ID of NPC default values
  defaultValues: npcInterface; //Values that NPC is initated from
  sprite: Sprite; //Sprite variable
  hasTurn: boolean;
  isPassive:boolean;

  //NPC Stats
  health: number;
  attack: number;
  defense: number;
  range:number;
  regen:number;

  //Map coordinate
  x: number;
  y: number;

  itemList: Array<itemInterface>;

  constructor(x: number, y: number, defaultValues: npcInterface, name: string) {
    //Sets NPC stats
    this.health = defaultValues.health;
    this.attack = defaultValues.attack;
    this.defense = defaultValues.defense;
    this.range = defaultValues.range;
    this.regen = defaultValues.regen;

    //Default value sets
    this.defaultValuesID = defaultValues.id;
    this.defaultValues = defaultValues;

    this.hasTurn = true;
    this.isPassive = defaultValues.isPassive;

    //Map coord sets
    this.x = x;
    this.y = y;

    this.name = name; //Sets NPC name
    this.itemList = []; //Creates item list

    //Increases ID number by 1, then sets
    recentID++;
    this.id = recentID;

    this.sprite = this.handleSprite(); //Sets sprite based on defaultValueID
  }

  //BUFF ID VALUES
  //[0, health][1, attack][2, defense][3, movement]
  doBuff(buff: buffInterface, increase: boolean) {
    switch (buff.statID) {
      case 0:
        this.health += buff.amount * (increase ? 1 : -1); //if how is true, * by 1, else * -21
      case 1:
        this.attack += buff.amount * (increase ? 1 : -1);
      case 2:
        this.defense += buff.amount * (increase ? 1 : -1);
    }
  }

  move(currentTile:Tile, nextTile:Tile){
    if(!this.hasTurn)return;
    if(!nextTile.isEmpty)return;
    this.x = nextTile.x;
    this.y = nextTile.y;
    this.render(nextTile.sprite.x, nextTile.sprite.y);
    nextTile.npc = this;
    currentTile.npc = undefined;
    currentTile.emptyCheck();
    nextTile.emptyCheck();
  }

  addItem(item: itemInterface) {
    if (this.itemList.includes(item)) return;

    this.itemList.push(item);
    item.buffList.forEach((value) => {
      this.doBuff(value, true);
    });
  }

  removeItem(item: itemInterface) {
    if(this.itemList === undefined)return;
    if(!this.itemList.includes(item))return;

    for(let [index, value] of this.itemList.entries()){
      if(value == item){
        this.itemList.splice(index, 1);
        for(let buff of item.buffList ){
          this.doBuff(buff, false);
        }
      }
    }
  }

  doCombat(enemy: NPC) {
    if(!this.hasTurn) return;
    enemy.health -= this.attack;
    if (enemy.health < 0) {
      enemy.delete();
    } else {
      this.health -= enemy.attack;
      if (this.health < 0) {
        this.delete();
      }
    }
  }

  delete() {
    this.sprite.destroy();
    let tile: Tile | undefined = game.world.grid.at(this.x)?.at(this.y);
    if (tile !== undefined) {
      tile.npc = undefined;
      game.world.npcMap.delete(this.id);
    }
  }

  randomMovement(){
    if(!this.hasTurn)return;

    let min = this.range * -1;
    let max = this.range;
    if(this.x + min < 0) min = min + this.x;
    if(this.y + min < 0) min = min + this.y;
    if(this.x + max > game.world.size) max = this.x - max;
    if(this.y + max > game.world.size) max = this.y - max;
    
    let x = Math.floor(Math.random() * (max - min) ) + min;
    let y = Math.floor(Math.random() * (max - min) ) + min;

    if(x === undefined || y === undefined) return;

    let currentTile: Tile | undefined = game.world.grid.at(this.x)?.at(this.y);
    let newTile: Tile | undefined = game.world.grid.at(this.x + x)?.at(this.y + y);
    if(currentTile === undefined || newTile === undefined) return;

    if(Math.abs(currentTile.x - newTile.x) > this.range) return;
    if(Math.abs(currentTile.y - newTile.y) > this.range) return;

    this.move(currentTile, newTile);
    this.hasTurn = false;
  }

  combatCheck(){
    if(!this.hasTurn) return;
    let currentTile: Tile | undefined = game.world.grid.at(this.x)?.at(this.y);
    if(currentTile === undefined) return;
    if(this.defaultValuesID === 0) return;

    for(let [key, npc] of game.world.npcMap.entries()){
      if(key === undefined) continue;
      if(npc.defaultValuesID !== 0) continue;

      let npcTile: Tile | undefined = game.world.grid.at(npc.x)?.at(npc.y);
      if(npcTile === undefined) continue;
      if(!game.world.distanceCheck(currentTile, npcTile, this.range))continue;
      if(Math.random() < 0.5) continue;
      this.doCombat(npc);
      this.hasTurn = false;
    }
  }

  render(x: number, y: number) {
    this.sprite.width = game.world.spriteWidth *  0.8;
    this.sprite.height = game.world.spriteHeight * 0.8;

    this.sprite.x = x + this.sprite.width * 0.2;
    this.sprite.y = y;

    game.world.container.addChild(this.sprite);
  }

  handleNextTurn() {
    this.hasTurn = true;
    this.health += this.regen;
    if(this.health > this.defaultValues.health) this.health = this.defaultValues.health;
  }

  handleSprite() {
    switch (this.defaultValuesID) {
      case 0:
        return Sprite.from(villagerTexture);
      case 1:
        return Sprite.from(animalsTexture);
      default:
        return Sprite.from(missingTexture);
    }
  }
}

export { NPC, npcInterface };
