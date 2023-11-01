import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import "dotenv/config";
import { TileService } from "src/tile/tile.service";
import { StateEntity } from "./state.entity";

@Injectable()
export class StateService {
  @InjectRepository(StateEntity)
  private readonly stateRepo: Repository<StateEntity>;

  constructor(private readonly tileService: TileService) {}

  async initStates(amount:number){
    for(let i = 1; i < amount; i++){
      const tile = await this.tileService.getRandomCapitalTile(i);
      this.stateRepo.insert({
        id: i,
        capitalId: tile.id,
        tileIds: [tile.id],
        colourId: i % 6 + 1
      });
      this.tileService.setStateId(tile.id, i);
    }
  }

  async getAllStates(){
    let states = await this.stateRepo.find();
    return states;
  }

  async deleteAllStates(){
    let toDelete = await this.stateRepo.find();
    this.stateRepo.remove(toDelete);
  }
}
