import { Controller, Get, Post, Query } from "@nestjs/common";
import { StateService } from "./state.service";
@Controller("state")
export class StateController {
  constructor(private readonly stateService: StateService) {}
  @Get("getStates")
  async get(){
    try{
      return await this.stateService.getAllStates();
    }catch(e){
      console.error(e);
    }
  }
}
