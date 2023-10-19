import { Container, Sprite } from "pixi.js";
import { game } from "../..";
import { NPC, npcInterface } from "../npc/npc";
import { Building, buildingInterface } from "./building";
import { dirtTexture, grassTexture, mountainTexture, rangeHighlight, sandTexture, stoneTexture, waterTexture } from "../util/textures";
import { Node, nodeInterface } from "./node";
import { mine } from "../defaults/builds";
import { chicken } from "../defaults/npc";
import { chest, ore, tree } from "../defaults/node";

class Tile {
  x: number;
  y: number;
  q: number;
  r: number;
  sprite: Sprite;
  highlightSprite: Sprite;
  isHighlighted:boolean;
  npc?: NPC;
  building?: Building;
  node?: Node;
  isEmpty: boolean;
  biome: number;

  constructor(x: number, y: number, biome: number, container: Container) {
    this.x = x;
    this.y = y;
    this.q = x - (y - (y&1)) / 2;
    this.r = y;
    this.sprite = this.handleSprite(biome);

    this.highlightSprite = Sprite.from(rangeHighlight);
    this.isHighlighted = false;

    this.highlightSprite.visible = false; //Make invisible until selected tile

    this.biome = biome;
    

    this.sprite.interactive = true;
    this.sprite.on("mousedown", () => game.world.setCurrent(this.x, this.y));

    container.addChild(this.sprite);
    this.isEmpty = true;
  }

  addRandom(){
    if(this.biome < 0.1) return;

    let node = Math.random() * 100;
    if(node < 10){
      this.addNode(this.x, this.y, tree, 10);
    }else if(node < 15){
      this.addNode(this.x, this.y, ore, 10);
    }else if(node < 15.5){
      this.addNode(this.x, this.y, chest, 1);
    }else{
      //nothing
    }

    let npc = Math.random() * 100;
    if(npc < 2.5){
      this.addNPC(this.x, this.y, chicken, "Chicken");
    }else if(npc < 5){
    }
  }

  emptyCheck() {
    if (
      this.npc === undefined &&
      this.building === undefined &&
      this.node === undefined
    ) {
      this.isEmpty = true;
    } else this.isEmpty = false;
  }

  toggleHighlight(bool:boolean){
    this.isHighlighted = bool;
    this.highlightSprite.visible = bool;
  }

  addNPC(x: number, y: number, type: npcInterface, name: string) {
    this.emptyCheck();
    if (!this.isEmpty) return;

    this.npc = new NPC(x, y, type, name);
    game.world.npcMap.set(this.npc.id, this.npc);

    this.emptyCheck();
  }

  addBuilding(x: number, y: number, type: buildingInterface) {
    this.emptyCheck();
    if (!this.isEmpty) return;

    this.building = new Building(x, y, type);
    game.world.buildMap.set(this.building.id, this.building);

    this.emptyCheck();
  }

  addNode(x: number, y: number, type: nodeInterface, amount: number) {
    this.emptyCheck();
    if (!this.isEmpty) return;

    this.node = new Node(x, y, type, amount);

    this.emptyCheck();
  }

  render() {
    if (this.isEmpty) return;
    if (this.npc !== undefined) {
      let npc: NPC | undefined = this.npc;
      if (npc !== undefined) {
        npc.render(this.sprite.x, this.sprite.y);
      }
    }
    if (this.building !== undefined) {
      let build: Building | undefined = this.building;
      if (build !== undefined) {
        build.render(this.sprite.x, this.sprite.y);
      }
    }
    if (this.node !== undefined) {
      let node: Node | undefined = this.node;
      if (node !== undefined) {
        node.render(this.sprite.x, this.sprite.y);
      }
    }
  }

  handleSprite(biome: number) {
    if (biome < -0.2) {
      return Sprite.from(waterTexture);
    } else if(biome < 0.1) {
      return Sprite.from(sandTexture);
    }else{
      return Sprite.from(grassTexture)
    }
  }
}

export { Tile };
