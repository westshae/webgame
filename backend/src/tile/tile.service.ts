import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import "dotenv/config";
import { TileEntity } from "./tile.entity";
import { randomInt } from "crypto";
import { Tile } from "./tile";

@Injectable()
export class TileService {
  @InjectRepository(TileEntity)
  private readonly tileRepo: Repository<TileEntity>;

  generateWorld(){
    for(let i = 0; i < 10; i++){
      for(let j = 0; j < 10; j++){
        this.tileRepo.insert({
          id: randomInt(99999999),
          x: i,
          y: j
        });
      }
    }
  }

  async loadWorld(){
    let tiles = [];
    let foundTiles:TileEntity[] = await this.tileRepo.find();
    for(let tileInfo of foundTiles){
      const tile = new Tile(tileInfo.id, tileInfo.x, tileInfo.y);
      tiles.push(tile);
    }

    return tiles;
  }
}