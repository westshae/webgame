import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import "dotenv/config";
import { TileService } from "src/tile/tile.service";
import { StateEntity } from "./state.entity";
import { randomInt } from "crypto";

@Injectable()
export class StateService {
  @InjectRepository(StateEntity)
  private readonly stateRepo: Repository<StateEntity>;

  constructor(private readonly tileService: TileService) {}

  getRandomHexCode() {
    const letters = "0123456789ABCDEF";
    let tint = 0;
    for (let i = 0; i < 6; i++) {
      tint = (tint << 4) | letters.indexOf(letters[Math.floor(Math.random() * 16)]);
    }
    return tint;
  }
  
  async initStates(amount:number){
    for(let i = 1; i < amount; i++){
      const tile = await this.tileService.getRandomCapitalTile(i);
      const hexcode = this.getRandomHexCode();
      this.stateRepo.insert({
        id: i,
        capitalId: tile.id,
        tileIds: [tile.id],
        hexcode: hexcode,
        decisions: []
      });
      this.tileService.setStateOwner(tile.id, i, hexcode, true);
    }
  }

  async giveAllStatesNewTile(){
    let states = await this.getAllStates();
    for(let state of states){
      this.giveStateNewTile(state.id);
    }
  }

  async giveStateNewTile(stateId){
    let entity = await this.stateRepo.findOne({
      id: stateId
    });

    let count = 0
    while (count < 10){
      let adjacentTiles = await this.tileService.getAllAdjacentTiles(entity.tileIds[randomInt(entity.tileIds.length)]);
      let newTile = adjacentTiles[randomInt(adjacentTiles.length)];
      if(newTile != null && newTile.stateId == null){
        this.tileService.setStateOwner(newTile.id, entity.id, entity.hexcode, false);
        entity.tileIds.push(newTile.id);
        this.stateRepo.save(entity);
        break;
      }
      count++;
    }
  }

  async getControlledStates(email: string){
    let entities = await this.stateRepo.find({
      controllerId: email
    });

    if(entities.length != 0){
      return entities;
    } else {
      return [await this.giveControlledStates(email)];
    }
  }

  async giveControlledStates(email:string){
    let entities = await this.stateRepo.find({
      controllerId: null
    });

    let index = randomInt(entities.length);
    let entity = entities[index];
    entity.controllerId = email;
    await this.stateRepo.save(entity);
    return entity;
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
      question:"questionhere",
      actionType: 0
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
    const index = entity.decisions.findIndex(decision => JSON.parse(decision).id === decisionId);
    if(index == -1){
      return;
    }
    const removedDecision = entity.decisions.splice(index, 1)[0]; 
    await this.stateRepo.save(entity)

    if(optionNumber == 1) {
      await this.giveStateNewTile(stateId);
    } 
    
    console.log(JSON.parse(removedDecision).question);
  }

  async getStateTiles(email:string){
    let stateEntities = await this.getControlledStates(email);

    let tiles = [];
    for(let entity of stateEntities){
      let nearTiles = await this.tileService.getAllTilesWithinDistance(entity.capitalId, 6);
      tiles.push(...nearTiles);
    }
    return tiles;
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
