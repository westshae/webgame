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
    this.decisionRepo.insert({
      id: randomInt(99999999),
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
}