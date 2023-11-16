import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import "dotenv/config";
import { TileService } from "src/tile/tile.service";
import { StateEntity } from "./state.entity";
import { randomInt } from "crypto";
import { take } from "rxjs";
import { Tile } from "src/tile/tile";

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
      this.stateRepo.insert({
        id: i,
        capitalId: tile.id,
        tileIds: [tile.id],
        hexcode: this.getRandomHexCode(),
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

  async giveStateNewTile(stateId){
    let entity = await this.stateRepo.findOne({
      id: stateId
    });

    let count = 0
    while (count < 10){
      let tile = await this.tileService.getTileFromId(entity.tileIds[randomInt(entity.tileIds.length)]);

      let newTileId = tile.connectedTiles[randomInt(tile.connectedTiles.length)];
      let newTile = await this.tileService.getTileFromId(newTileId);
      if(newTile.stateId == null){
        this.tileService.setStateId(newTileId, entity.id);
        entity.tileIds.push(newTileId);
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
    const index = decisions.findIndex(decision => JSON.parse(decision).id === decisionId);
    if(index == -1){
      return;
    }
    const removedDecision = decisions.splice(index, 1)[0]; 
    
    this.giveStateNewTile(stateId);
    console.log(JSON.parse(removedDecision).question);
  }

  async getStateTiles(email:string){
    let stateEntities = await this.getControlledStates(email);

    let tiles = [];
    for(let entity of stateEntities){
      let nearTiles = await this.tileService.getAllTilesWithinDistance(entity.capitalId, 6);
      for (let tileInfo of nearTiles) {
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
