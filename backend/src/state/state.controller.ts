import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { StateService } from "./state.service";
import { AuthService } from "src/auth/auth.service";
@Controller("state")
export class StateController {
  constructor(private readonly stateService: StateService, private readonly authService: AuthService) {}

  //TODO To Remove
  @Get("getStates")
  async getStates(){
    try{
      return await this.stateService.getAllStates();
    }catch(e){
      console.error(e);
    }
  }

  @Get("getDecisionCount")
  async getDecisionCount(@Query('stateId') stateId, @Query('email') email, @Query('jwt') jwt){
    try{
      if(!this.authService.checkToken(email, jwt)){
        return;
      }

      return await this.stateService.getDecisionCount(stateId);
    }catch(e){
      console.error(e);
    }
  }

  @Get("getDecision")
  async getDecision(@Query('stateId') stateId, @Query('email') email, @Query('jwt') jwt){
    try{
      if(!this.authService.checkToken(email, jwt)){
        return;
      }

      return await this.stateService.getFirstDecision(stateId);
    }catch(e){
      console.error(e);
    }
  }

  @Post("completeDecision")
  completeDecision(@Body() data: { stateId: number, decisionId: number, optionNumber:number, email:string, jwt:string }){
    try{
      if(!this.authService.checkToken(data.email, data.jwt)){
        return;
      }
      this.stateService.completeDecision(data.stateId, data.decisionId, data.optionNumber);
    }catch(e){
      console.error(e);
    }
  }

  @Get("getControlledStates")
  async getControlledStates(@Query('email') email, @Query('jwt') jwt){
    try{
      if(!this.authService.checkToken(email, jwt)){
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");
        console.log("restasdasdasdasdasd");

        return "weird ass string";
      }
      return await this.stateService.getControlledStates(email);
    }catch(e){
      console.error(e);
    }
  }
}
