import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import "dotenv/config";
import { TileEntity } from "./tile.entity";
import { randomInt } from "crypto";
import { Tile } from "./tile";
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class TileService {
  @InjectRepository(TileEntity)
  private readonly tileRepo: Repository<TileEntity>;

  @InjectRepository(TileEntity)
  private readonly userRepo: Repository<UserEntity>;

  async generateWorld(size:number){
    const tiles = await this.tileRepo.find();
    await this.tileRepo.remove(tiles);

    const noise = createNoise2D();

    let count = 0;
    for(let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        this.tileRepo.insert({
          id: count,
          x: i,
          y: j,
          population: 0,
          type: this.determineBiome(i,j, noise),
          farmland: randomInt(10),
          farmlandUtitized: randomInt(100),
          ownerUserId: null
        });
        count++;
      }
    }

    let toDelete = await this.userRepo.find();
    this.userRepo.remove(toDelete);
  }

  async loadWorld(){
    let tiles = [];
    let foundTiles:TileEntity[] = await this.tileRepo.find();

    for(let tileInfo of foundTiles){
      const tile = new Tile(tileInfo.id, tileInfo.x, tileInfo.y, tileInfo.population, tileInfo.type, tileInfo.farmland, tileInfo.farmlandUtitized, tileInfo.ownerUserId);
      tiles.push(tile);
    }

    return tiles;
  }

  determineBiome(x:number, y:number, noise:NoiseFunction2D){
    let biomeNumber = noise(x/16, y/16);
    if (biomeNumber < -0.2) {
      return "Water";
    } else if (biomeNumber < 0.1) {
      return "Sand";
    } else  if (biomeNumber < 0.5) {
      return "Grass";
    } else {
      return "Stone"
    }
  }

  async updateTilePopulation(amount:number) {
    let foundTiles: TileEntity[] = await this.tileRepo.find();

    for (let tileInfo of foundTiles) {
      tileInfo.population = tileInfo.population + amount;
    }
    await this.tileRepo.save(foundTiles);
  }

  async getRandomCapitalTile(userId:number){
    let foundTiles: TileEntity[] = await this.tileRepo.find({
      ownerUserId: null,
      type: Not("Water")
    });

    let randomValue = randomInt(foundTiles.length-1);
    let tileEntity = foundTiles[randomValue];

    tileEntity.ownerUserId = userId;
    this.tileRepo.save(tileEntity);

    let tile = new Tile(tileEntity.id, tileEntity.x, tileEntity.y, tileEntity.population, tileEntity.type, tileEntity.farmland, tileEntity.farmlandUtitized, userId)
    return tile;
  }
}