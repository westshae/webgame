import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import "dotenv/config";
import { DecisionEntity } from "./decisions.entity";
import { randomInt } from "crypto";
import { Decision } from "./decisions";

@Injectable()
export class DecisionService {
  @InjectRepository(DecisionEntity)
  private readonly decisionRepo: Repository<DecisionEntity>;

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
}