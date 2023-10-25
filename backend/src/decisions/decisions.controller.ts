import { Controller, Get, Post, Query } from "@nestjs/common";
import { DecisionService } from "./decisions.service";

@Controller("decision")
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  // @Post("createWorld")
  // post(@Query('size') size: number){
  //   try{
  //     this.decisionService.generateWorld(16);
  //   }catch(e){
  //     console.error(e);
  //   }
  // }

  @Get("getDecision")
  async get(@Query() query){
    try{
      return await this.decisionService.getDecisionFromQueue();
    }catch(e){
      console.error(e);
    }
  }
}
