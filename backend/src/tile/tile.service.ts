import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, In, Not, Repository } from "typeorm";
import "dotenv/config";
import { TileEntity } from "./tile.entity";
import { randomInt } from "crypto";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";

@Injectable()
export class TileService {
  @InjectRepository(TileEntity)
  private readonly tileRepo: Repository<TileEntity>;

  async generateWorld(size: number) {
    const tiles = await this.tileRepo.find();
    await this.tileRepo.remove(tiles);

    const noise = createNoise2D();

    let count = 0;
    const tilesToInsert = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        tilesToInsert.push({
          id: count,
          x: i,
          y: j,
          q: i - (j - (j & 1)) / 2,
          housingMax: randomInt(99),
          biome: this.determineBiome(i, j, noise),
          farmlandMax: randomInt(99),
          stateId: null,
          hasCapital: false,
          hexcode: null
        });
        count++;
      }
    }
    await this.tileRepo.insert(tilesToInsert);
  }

  determineBiome(x: number, y: number, noise: NoiseFunction2D) {
    let biomeNumber = noise(x / 16, y / 16);
    if (biomeNumber < -0.2) {
      return "Water";
    } else if (biomeNumber < 0.1) {
      return "Sand";
    } else if (biomeNumber < 0.5) {
      return "Grass";
    } else {
      return "Stone";
    }
  }

  async getRandomCapitalTile(stateId: number) {
    let foundTiles: TileEntity[] = await this.tileRepo.find({
      stateId: null,
      biome: Not("Water"),
    });

    if (foundTiles.length == 0) {
      return null;
    }

    let randomValue = randomInt(foundTiles.length - 1);
    let tileEntity = foundTiles[randomValue];

    tileEntity.stateId = stateId;
    this.tileRepo.save(tileEntity);

    return tileEntity;
  }

  async getAllTilesWithinDistance(tileId: number, distance: number) {
    const centralTile = await this.tileRepo.findOne({ id: tileId });
    if (!centralTile) {
      return [];
    }
  
    // Calculate the range for axial coordinates
    const xRange = [centralTile.x - distance, centralTile.x + distance];
    const yRange = [centralTile.y - distance, centralTile.y + distance];
  
    // Filter tiles within the specified range
    const tiles = await this.tileRepo.find({
      where: {
        x: Between(xRange[0], xRange[1]),
        y: Between(yRange[0], yRange[1]),
      },
    });

    const filteredTiles = tiles.filter((tile) => {
      let tempDistance = distance - Math.abs(centralTile.y - tile.y)/2
      if(centralTile.y % 2 !== tile.y % 2){
        if(tile.y < centralTile.y){// top
          if(tile.x < centralTile.x - tempDistance){
            if(centralTile.y % 2 == 1){
              return false;
            }
          }  
        } else {
          if(tile.x > centralTile.x + tempDistance){
            if(centralTile.y % 2 == 0){
              return false;
            }
          }
        }
      }

      const q = tile.x - Math.floor((tile.y - (tile.y & 1)) / 2);
      const centralQ = centralTile.x - Math.floor((centralTile.y - (centralTile.y & 1)) / 2);
  
      const dx = Math.abs(tile.x - centralTile.x);
      const dy = Math.abs(tile.y - centralTile.y);
  
      return dx + Math.floor(dy / 2) <= distance && Math.abs(q - centralQ) <= distance;
    });
  
    return filteredTiles;
  }

  getAllAdjacentCoordinates(x:number, y:number){
    const adjacentCoordinates = [
      [x, y - 1], // Left
      [x, y + 1], // Right
      [x - 1, y], // Above
      [x + 1, y], // Below
      y % 2 === 0 ? [x - 1, y - 1] : [x + 1, y - 1], // Top-left (if j is even) or Top-right (if j is odd)
      y % 2 === 0 ? [x - 1, y + 1] : [x + 1, y + 1], // Bottom-left (if y is even) or Bottom-right (if j is odd)
    ];
    return adjacentCoordinates;
  }

  async getAllAdjacentTiles(tileId:number){
    const tile = await this.tileRepo.findOne({id:tileId});
    const adjacentCoordinates = this.getAllAdjacentCoordinates(tile.x, tile.y);

    const promises = [];

    for(const [x,y] of adjacentCoordinates){
      promises.push(this.tileRepo.findOne({
        x:x,
        y:y
      }))
    }
    return await Promise.all(promises);
  }

  async getTileFromId(id: number){
    return await this.tileRepo.findOne({id:id});
  }

  async getTileAtCoordinates(x:number, y:number){
    return await this.tileRepo.findOne({x:x, y:y});
  }

  async getTilesFromStateId(stateId:number){
    return await this.tileRepo.find({stateId:stateId});
  }

  async setStateOwner(tileId:number, stateId:number, hexcode:number, isCapital:boolean){
    let tile = await this.tileRepo.findOne({id:tileId});
    tile.stateId = stateId;
    tile.stateHexcode = hexcode;
    tile.hasCapital = isCapital;
    this.tileRepo.save(tile);
  }

  async deleteAllTiles() {
    let tiles = await this.tileRepo.find();
    this.tileRepo.remove(tiles);
  }
}
