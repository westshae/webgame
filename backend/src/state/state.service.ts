import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import "dotenv/config";
import { TileService } from "src/tile/tile.service";
import { StateEntity } from "./state.entity";
import { randomInt } from "crypto";

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
        colourId: i % 6 + 1,
        decisions: []
      });
      this.tileService.setStateId(tile.id, i);
    }
  }

  async giveAllStatesNewTile(){
    let states = await this.getAllStates();
    for(let state of states){
      let count = 0
      while (count < 10){
        let tile = await this.tileService.getTileFromId(state.tileIds[randomInt(state.tileIds.length)]);

        let newTileId = tile.connectedTiles[randomInt(tile.connectedTiles.length)];
        let newTile = await this.tileService.getTileFromId(newTileId);
        if(newTile.stateId == null){
          this.tileService.setStateId(newTileId, state.id);
          state.tileIds.push(newTileId);
          this.stateRepo.save(state);
          break;
        }
        count++;
      }
    }
  }

  async addDecisionToAllStates(){
    let stateEntities = await this.getAllStates();
    for(let entity of stateEntities){
      await this.addNewDecision(entity.id);
    }
  }

  async addNewDecision(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    let decision = {
      id: randomInt(99999999),
      question:"questionhere"
    }
    entity.decisions.push(JSON.stringify(decision));
    this.stateRepo.save(entity);
  }

  async getDecisionCount(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    return entity.decisions.length;
  }

  async getFirstDecision(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    return entity.decisions[0]
  }

  async completeDecision(stateId:number, decisionId:number, optionNumber:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    let decisions = entity.decisions;
    const index = decisions.findIndex(decision => JSON.parse(decision).id === stateId);
    if(index == -1){
      return;
    }
    const removedDecision = decisions.splice(index, 1)[0]; 
    console.log(JSON.parse(removedDecision).question);
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
