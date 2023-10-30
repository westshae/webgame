import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import "dotenv/config";
import { DecisionEntity } from "./decisions.entity";
import { randomInt } from "crypto";
import { Decision } from "./decisions";
import { TileService } from "src/tile/tile.service";

@Injectable()
export class DecisionService {
  @InjectRepository(DecisionEntity)
  private readonly decisionRepo: Repository<DecisionEntity>;
  constructor(private readonly tileService: TileService) {}

  async addDecisionToQueue(question:string) {
    let id = randomInt(9999999);
    this.decisionRepo.insert({
      id: id,
      question: question,
    });
  }

  async getDecisionFromQueue(){
    let entity = await this.decisionRepo.findOne();
    let decision = new Decision(entity.id, entity.question);
    return decision;
  }

  finishDecision(optionNumber:number, questionId:number){
    this.tileService.updateTilePopulation(optionNumber);
  }

  async getAllDecisions(){
    let entities = await this.decisionRepo.find();
    let decisions:Decision[] = [];
    for(let entity of entities){
      let decision = new Decision(entity.id, entity.question);
      decisions.push(decision);
    }
    return decisions;

  }

  async deleteAllDecisions(){
    let decisions = await this.decisionRepo.find();
    this.decisionRepo.remove(decisions);
  }
}