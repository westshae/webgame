import { Tile } from "./tile";
import SimplexNoise from "../../../node_modules/simplex-noise/dist/cjs/simplex-noise";
import { NPC, npcInterface } from "../npc/npc";
import { Building, buildingInterface } from "./building";
import { Node, nodeInterface } from "./node";
import { Container, Sprite } from "pixi.js";
import { selectorTexture } from "../util/textures";
import { game } from "../..";
import { townCenter } from "../defaults/builds";
import { allItemsMap } from "../defaults/items";

class World {
  container: Container;
  grid: Array<Array<Tile>>;
  size: number;
  screenSize: number;
  npcMap: Map<number, NPC>;
  buildMap: Map<number, Building>;
  currentTile?: Tile;
  selector: Sprite;
  buildMode: boolean;
  currentInteraction?: number;
  spriteWidth: number;
  spriteHeight: number;

  constructor(size: number) {
    this.size = size;
    this.spriteWidth = Math.sqrt(3) * 50;
    this.spriteHeight = 2 * 50;

    this.container = new Container();
    this.screenSize = this.spriteWidth * size * 5;
    this.grid = this.generateGrid();
    this.npcMap = new Map<number, NPC>();
    this.buildMap = new Map<number, Building>();

    this.buildMode = false;
    this.selector = Sprite.from(selectorTexture);
    this.createSelector();
  }

  toggleBuildMode() {
    this.buildMode = !this.buildMode;
  }

  distanceCheck(currentTile: Tile, nextTile: Tile, range: number) {
    let moved =
      (Math.abs(currentTile.q - nextTile.q) +
        Math.abs(currentTile.q + currentTile.r - nextTile.q - nextTile.r) +
        Math.abs(currentTile.r - nextTile.r)) /
      2;

    if (moved <= range) return true;
    else return false;
  }

  highlightRange(
    middleTile: Tile,
    currentTile: Tile,
    npc: NPC,
    highlight: boolean
  ) {
    //recursive
    if (currentTile.isHighlighted == highlight) return;

    if (this.distanceCheck(middleTile, currentTile, npc.range)) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let tile = this.grid.at(currentTile.x + i)?.at(currentTile.y + j);
          if (tile !== undefined) {
            this.highlightRange(middleTile, tile, npc, highlight);
            currentTile.toggleHighlight(highlight);
          }
        }
      }
    }
  }

  createSelector() {
    this.selector.width = this.spriteWidth;
    this.selector.height = this.spriteHeight;

    this.selector.visible = false; //Make invisible until selected tile
    this.container.addChild(this.selector); //Adds to world container
  }

  addNPC(x: number, y: number, type: npcInterface, name: string) {
    let tile: Tile | undefined = this.grid.at(x)?.at(y);
    if (tile === undefined) return;
    tile.addNPC(x, y, type, name);
  }

  addBuilding(x: number, y: number, type: buildingInterface) {
    let tile: Tile | undefined = this.grid.at(x)?.at(y);
    if (tile === undefined) return;
    tile.addBuilding(x, y, type);
    tile.render();
  }

  addNode(x: number, y: number, type: nodeInterface, amount: number) {
    let tile: Tile | undefined = this.grid.at(x)?.at(y);
    if (tile === undefined) return;
    tile.addNode(x, y, type, amount);
  }

  setCurrent(x: number, y: number) {
    let tile: Tile | undefined = this.grid.at(x)?.at(y);
    if (tile === undefined) return;

    if (this.currentTile === undefined) {
      if (tile.isEmpty && !this.buildMode) return;

      this.setAction(tile);

      if (!this.buildMode) return;
      this.handleBuild(tile);
    } else if (this.currentTile === tile) {
       this.resetAction(this.currentTile);
    }
      else {
        tile.emptyCheck();
        if (tile.isEmpty) this.handleMovement(tile);
        else if (tile.npc !== undefined) this.handleAttack(tile);
        else if (tile.node !== undefined) this.handleInteraction(tile);
        else this.resetAction(tile);
      }
    }
  

  setAction(tile: Tile) {
    this.currentTile = tile;
    this.selector.x = tile.sprite.x;
    this.selector.y = tile.sprite.y;
    this.selector.visible = true;

    game.hud.displayTile(tile);

    if (this.currentTile?.npc !== undefined) {
      game.hud.toggleActionVisible(true);
    } else {
      game.hud.toggleActionVisible(false);
    }

    if (this.currentTile.npc === undefined) return;
    if(this.currentTile.npc.defaultValuesID !== 0) return;
    this.highlightRange(tile, tile, this.currentTile.npc, true);
  }

  resetAction(nextTile: Tile) {
    if (this.currentTile !== undefined && nextTile.npc?.range !== undefined) {
      this.highlightRange(
        this.currentTile,
        this.currentTile,
        nextTile.npc,
        false
      );
    }

    if (this.currentTile !== undefined && this.currentTile.npc !== undefined) {
      this.highlightRange(
        this.currentTile,
        this.currentTile,
        this.currentTile.npc,
        false
      );
    }

    this.currentTile = undefined;
    this.selector.visible = false;
    game.hud.toggleActionVisible(false);
    this.currentInteraction = undefined;
    game.hud.showDisplayTile(false);
  }

  handleMovement(nextTile: Tile) {
    let currentTile: Tile | undefined = this.currentTile;

    if (currentTile === undefined) return;
    if (nextTile.npc !== undefined) return;
    if (currentTile.npc === undefined) {
      this.resetAction(currentTile);
      return;
    }

    if (!this.distanceCheck(currentTile, nextTile, currentTile.npc.range))
      return;

    let npc: NPC | undefined = currentTile.npc;
    if (npc === undefined) return;

    npc.move(currentTile, nextTile);
    if (currentTile === undefined) return;
    this.resetAction(nextTile);
  }

  handleAttack(tile: Tile) {
    let currentTile: Tile | undefined = this.currentTile;
    if (currentTile?.npc === undefined) return;

    if (!this.distanceCheck(currentTile, tile, currentTile.npc.range)) return;

    let villager: NPC | undefined = currentTile.npc;
    let enemy: NPC | undefined = tile.npc;
    if (villager.defaultValuesID == enemy?.defaultValuesID) return;
    if (enemy === undefined) return;
    villager.doCombat(enemy);
    if (tile.npc === undefined) this.handleMovement(tile);

    this.resetAction(tile);
  }
  handleInteraction(tile: Tile) {
    let tileInit: Tile | undefined = game.world.currentTile;
    if (tileInit === undefined) return;
    if (tileInit.npc === undefined) return;
    if (tile.node === undefined) return;

    if (!this.distanceCheck(tileInit, tile, tileInit.npc.range)) return;

    game.data.changeResource(tile.node.type, tile.node.amount, true);
    if(this.currentTile !== undefined && this.currentTile.npc !== undefined){ 
      if(tile.node.type == 6){  //If its a chest
        let X:Number = Math.floor(Math.random() * (allItemsMap.size));
        this.currentTile.npc.addItem(allItemsMap.get(X)); 
      }else if(tile.node.item !== undefined){
        this.currentTile.npc.addItem(tile.node.item);
      }
     }
     tile.node.delete();

    if (tile.node === undefined) this.handleMovement(tile);

    this.resetAction(tile);
  }

  handleBuild(tile: Tile) {
    if (tile.building === undefined)
      this.addBuilding(tile.x, tile.y, townCenter);
    else tile.building.delete();

    this.resetAction(tile);
  }

  generateGrid() {
    let grid: Array<Array<Tile>> = [];
    const biome = new SimplexNoise(Math.random());
    for (let width: number = 0; width < this.size; width++) {
      grid[width] = [];
      for (let height: number = 0; height < this.size; height++) {
        grid[width][height] = new Tile(
          width,
          height,
          biome.noise2D(width / 16, height / 16),
          this.container
        );
      }
    }
    return grid;
  }

  generateRandom(){
    const random = new SimplexNoise(Math.random());
    for(let width: number = 0; width < this.size; width++){
      for(let height: number = 0; height < this.size; height++){
        let tile: Tile | undefined = this.grid.at(width)?.at(height);
        if(tile === undefined) continue;
        tile.addRandom();
      }
    }
  }

  render() {
    for (let value of this.grid) {
      for (let tile of value) {
        tile.sprite.width = this.spriteWidth;
        tile.sprite.height = this.spriteHeight;

        let yindex = tile.y - 1;
        let heightOffset =
          (this.spriteHeight / 2) * (Math.round(yindex / 2) - 2);

        if (yindex % 2 == 0) {
          //If even line
          tile.sprite.x = tile.x * this.spriteWidth + this.spriteWidth / 2;
          tile.sprite.y = yindex * this.spriteHeight - heightOffset;
        } else {
          //If odd line
          tile.sprite.x = tile.x * this.spriteWidth;
          tile.sprite.y =
            yindex * this.spriteHeight + this.spriteHeight / 4 - heightOffset;
        }

        tile.highlightSprite.x = tile.sprite.x;
        tile.highlightSprite.y = tile.sprite.y;

        tile.render();

        tile.highlightSprite.width = this.spriteWidth;
        tile.highlightSprite.height = this.spriteHeight;
        this.container.addChild(tile.highlightSprite); //Adds to world container
      }
    }
  }
}

export { World };
