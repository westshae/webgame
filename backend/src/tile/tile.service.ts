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

  async generateWorld(size:number){
    const tiles = await this.tileRepo.find();
    await this.tileRepo.remove(tiles);

    const biome = createNoise2D();

    let count = 0;
    for(let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        this.tileRepo.insert({
          id: count,
          x: i,
          y: j,
          population: 0,
          biome: biome(i/16, j/16)
        });
        count++;
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