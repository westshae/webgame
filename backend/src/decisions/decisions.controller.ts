import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { DecisionService } from "./decisions.service";

@Controller("decision")
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @Post("finishDecision")
  post(@Body() data: { option: number, questionId: number }){
    try{
      this.decisionService.finishDecision(data.option, data.questionId)
    }catch(e){
      console.error(e);
    }
  }

  @Get("getDecision")
  async get(){
    try{
      return await this.decisionService.getDecisionFromQueue();
    }catch(e){
      console.error(e);
    }
  }
}
