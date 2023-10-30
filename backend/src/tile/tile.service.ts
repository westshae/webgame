import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
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
          0,
          this.determineBiome(i, j, noise),
          randomInt(10),
          randomInt(100),
          null,
        );
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
        population: tile.population,
        biome: tile.biome,
        farmland: tile.farmland,
        farmlandUtilized: tile.farmlandUtilized,
        ownerUserId: tile.ownerUserId,
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
        tileInfo.population,
        tileInfo.biome,
        tileInfo.farmland,
        tileInfo.farmlandUtilized,
        tileInfo.ownerUserId,
      );
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

  async updateTilePopulation(amount: number) {
    let foundTiles: TileEntity[] = await this.tileRepo.find();

    for (let tileInfo of foundTiles) {
      tileInfo.population = tileInfo.population + amount;
    }
    await this.tileRepo.save(foundTiles);
  }

  async getRandomCapitalTile(userId: number) {
    let foundTiles: TileEntity[] = await this.tileRepo.find({
      ownerUserId: null,
      biome: Not("Water"),
    });

    if (foundTiles.length == 0) {
      return null;
    }

    let randomValue = randomInt(foundTiles.length - 1);
    let tileEntity = foundTiles[randomValue];

    tileEntity.ownerUserId = userId;
    this.tileRepo.save(tileEntity);

    let tile = new Tile(
      tileEntity.id,
      tileEntity.x,
      tileEntity.y,
      tileEntity.q,
      tileEntity.connectedTiles,
      tileEntity.population,
      tileEntity.biome,
      tileEntity.farmland,
      tileEntity.farmlandUtilized,
      userId,
    );
    return tile;
  }

  async deleteAllTiles() {
    let tiles = await this.tileRepo.find();
    this.tileRepo.remove(tiles);
  }
}
