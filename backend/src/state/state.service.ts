import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import "dotenv/config";
import { TileService } from "src/tile/tile.service";
import { StateEntity } from "./state.entity";
import { randomInt } from "crypto";
import { Decision } from "./decisionHandler";

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
        decisions: [],
        farmlandCount: 0,
        housingCount: 0,
        populationCount: 0,
        foodCount: 0,
        farmlandWeight: 50,
        housingWeight: 50,
        populationWeight: 50,
        foodWeight: 50,
        landWeight: 50,
      });
      this.tileService.setStateOwner(tile.id, i, hexcode, true);
    }
  }

  async tickAllStateLogic(){
    let entity = await this.getAllStates();
    let promises = []
    for(let state of entity){
      promises.push(this.tickStateLogic(state.id));
    }
    await Promise.all(promises);
  }

  async tickStateLogic(stateId:number){
    await this.handleFarmlandOrHousing(stateId);
    await this.handleLandOrFood(stateId);
  }

  async tickAllStateDecisions(){
    let entity = await this.getAllStates();
    let promises = []
    for(let state of entity){
      promises.push(this.tickStateDecisions(state.id));
    }
    await Promise.all(promises);
  }

  async tickStateDecisions(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    if(entity.decisions.length < 10){
      return;
    } else {
      let decision = await this.getFirstDecision(stateId);
      await this.completeDecision(stateId, decision.key, randomInt(2));
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
    let key = Decision.getRandomKey();
    entity.decisions.push(key);
    this.stateRepo.save(entity);
  }

  async getDecisionCount(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    return entity.decisions.length;
  }

  async getFirstDecision(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    let decisionKey = entity.decisions[0];
    return {
      question: await Decision.getQuestion(decisionKey),
      key: decisionKey
    }
  }

  async completeDecision(stateId:number, decisionNumber:number, optionNumber:number){
    let entity = await this.stateRepo.findOne({id:stateId});
    const index = entity.decisions.indexOf(decisionNumber);
    const removedKey = entity.decisions.splice(index, 1)[0];
    if(removedKey == -1){
      return;
    }

    await Decision.executeKey(removedKey, entity, optionNumber);

    await this.stateRepo.save(entity);
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

  async handleFarmlandOrHousing(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});

    if(entity.farmlandWeight + entity.housingWeight <= 0){
      return;
    }

    const random = randomInt(entity.farmlandWeight + entity.housingWeight);
    if(random < entity.farmlandWeight){
      entity.farmlandCount ++;
    } else {
      entity.housingCount ++;
    }

    await this.stateRepo.save(entity);
  }

  async handleLandOrFood(stateId:number){
    let entity = await this.stateRepo.findOne({id:stateId});

    if(entity.landWeight + entity.populationWeight <= 0){
      return;
    }

    const random = randomInt(entity.landWeight + entity.populationWeight);
    if(random < entity.landWeight){
      await this.giveStateNewTile(stateId);
    } else {
      entity.populationCount ++;
    }

    await this.stateRepo.save(entity);
  }
}
