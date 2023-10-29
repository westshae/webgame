import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { GameloopService } from "./gameloop.service";

@Controller("gameloop")
export class GameloopController {
  constructor(private readonly gameloopService: GameloopService) {}

  @Post("startGameloop")
  startGameloop(@Body() data: { option: number, questionId: number }){
    try{
      this.gameloopService.startGameloop();
    }catch(e){
      console.error(e);
    }
  }
}
