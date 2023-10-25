import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import "dotenv/config";
import { TileEntity } from "./tile.entity";
import { randomInt } from "crypto";
import { Tile } from "./tile";
import { createNoise2D } from 'simplex-noise';

@Injectable()
export class TileService {
  @InjectRepository(TileEntity)
  private readonly tileRepo: Repository<TileEntity>;

  generateWorld(){
    const biome = createNoise2D();

    for(let i = 0; i < 10; i++){
      for(let j = 0; j < 10; j++){
        this.tileRepo.insert({
          id: randomInt(99999999),
          x: i,
          y: j,
          population: 0,
          biome: biome(i/16, j/16)
        });
      }
    }
  }

  async loadWorld(){
    let tiles = [];
    let foundTiles:TileEntity[] = await this.tileRepo.find();

    for(let tileInfo of foundTiles){
      const tile = new Tile(tileInfo.id, tileInfo.x, tileInfo.y, tileInfo.population, tileInfo.biome);
      tiles.push(tile);
    }

    return tiles;
  }

  async updateTilePopulation(amount:number) {
    let foundTiles: TileEntity[] = await this.tileRepo.find();

    for (let tileInfo of foundTiles) {
      // Increment the population value for each tile
      tileInfo.population = tileInfo.population + amount;
    }

    // Save the updated entities back to the repository
    await this.tileRepo.save(foundTiles);
  }
}