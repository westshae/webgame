import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import "dotenv/config";
import { TileEntity } from "./tile.entity";
import { randomInt } from "crypto";
import { Tile } from "./tile";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";

@Injectable()
export class TileService {
  @InjectRepository(TileEntity)
  private readonly tileRepo: Repository<TileEntity>;

  async generateWorld(size: number) {
    const tiles = await this.tileRepo.find();
    await this.tileRepo.remove(tiles);

    const noise = createNoise2D();

    let madeTiles = [];

    let count = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let tile = new Tile(
          count,
          i,
          j,
          i - (j - (j & 1)) / 2,
          [],
          this.determineBiome(i,j, noise),
          randomInt(99),
          randomInt(99),
          null
        )
        count++;
        madeTiles.push(tile);
      }
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = madeTiles[i * size + j]; // Get the current tile

        // Define the coordinates of adjacent tiles based on your grid structure
        const adjacentCoordinates = [
          [i, j - 1], // Left
          [i, j + 1], // Right
          [i - 1, j], // Above
          [i + 1, j], // Below
          j % 2 === 0 ? [i - 1, j - 1] : [i + 1, j - 1], // Top-left (if j is even) or Top-right (if j is odd)
          j % 2 === 0 ? [i - 1, j + 1] : [i + 1, j + 1], // Bottom-left (if j is even) or Bottom-right (if j is odd)
        ];

        // Iterate through adjacentCoordinates and add IDs to the connectedTiles array
        for (const [x, y] of adjacentCoordinates) {
          if (x >= 0 && x < size && y >= 0 && y < size) {
            const neighbor = madeTiles[x * size + y];
            tile.connectedTiles.push(neighbor.id);
          }
        }
      }
    }

    for (let tile of madeTiles) {
      this.tileRepo.insert({
        id: tile.id,
        x: tile.x,
        y: tile.y,
        q: tile.x - (tile.y - (tile.y & 1)) / 2,
        connectedTiles: tile.connectedTiles,
        housingMax: tile.housingMax,
        biome: tile.biome,
        farmlandMax: tile.farmlandMax,
        stateId: tile.stateId,
      });
    }
  }

  async loadWorld() {
    let tiles = [];
    let foundTiles: TileEntity[] = await this.tileRepo.find();

    for (let tileInfo of foundTiles) {
      const tile = new Tile(
        tileInfo.id,
        tileInfo.x,
        tileInfo.y,
        tileInfo.q,
        tileInfo.connectedTiles,
        tileInfo.biome,
        tileInfo.housingMax,
        tileInfo.farmlandMax,
        tileInfo.stateId
      )
      tiles.push(tile);
    }

    return tiles;
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

    let tile = new Tile(
      tileEntity.id, 
      tileEntity.x,
      tileEntity.y,
      tileEntity.q, 
      tileEntity.connectedTiles,
      tileEntity.biome,
      tileEntity.housingMax,
      tileEntity.farmlandMax,
      tileEntity.stateId
    )
    return tile;
  }

  async getAllTilesWithinDistance(tileId:number, distance:number){
    let ids = await this.getAllTilesWithinDistanceHelper(tileId, distance);
    const tiles = await this.tileRepo.find({
      where: {
        id: In([...ids]),
      },
    });

    return tiles;
  }

  private async getAllTilesWithinDistanceHelper(tileId:number, distance:number){
    let tile = await this.tileRepo.findOne({
      id:tileId
    });

    if(distance == 0){
      let tiles = new Set<number>();
      tiles.add(tileId);
      return tiles;
    } else {
      let set = new Set<number>();
      set.add(tileId);
      for(let id of tile.connectedTiles){
        let newSet = await this.getAllTilesWithinDistanceHelper(id, distance-1);
        set = new Set<number>([...set, ...newSet]);
      }
      return set;
    }
  }

  async getTileFromId(id: number){
    return await this.tileRepo.findOne({id:id});
  }

  async setStateId(tileId:number, stateId:number){
    let tile = await this.tileRepo.findOne({id:tileId});
    tile.stateId = stateId;
    this.tileRepo.save(tile);
  }

  async deleteAllTiles() {
    let tiles = await this.tileRepo.find();
    this.tileRepo.remove(tiles);
  }
}
