import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { StateService } from "./state.service";
@Controller("state")
export class StateController {
  constructor(private readonly stateService: StateService) {}
  @Get("getStates")
  async getStates(){
    try{
      return await this.stateService.getAllStates();
    }catch(e){
      console.error(e);
    }
  }

  @Get("getDecisionCount")
  async getDecisionCount(@Query('stateId') stateId){
    try{
      return await this.stateService.getDecisionCount(stateId);
    }catch(e){
      console.error(e);
    }
  }

  @Get("getDecision")
  async getDecision(@Query('stateId') stateId){
    try{
      return await this.stateService.getFirstDecision(stateId);
    }catch(e){
      console.error(e);
    }
  }

  @Post("completeDecision")
  completeDecision(@Body() data: { stateId: number, decisionId: number, optionNumber:number }){
    try{
      this.stateService.completeDecision(data.stateId, data.decisionId, data.optionNumber);
    }catch(e){
      console.error(e);
    }
  }
}
