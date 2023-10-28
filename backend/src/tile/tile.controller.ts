import { Controller, Get, Post, Query } from "@nestjs/common";
import { TileService } from "./tile.service";

@Controller("tile")
export class TileController {
  constructor(private readonly tileService: TileService) {}

  @Post("createWorld")
  post(@Query('size') size: number){
    try{
      this.tileService.generateWorld(64);
    }catch(e){
      console.error(e);
    }
  }

  @Get("getWorld")
  async get(@Query() query){
    try{
      return await this.tileService.loadWorld();
    }catch(e){
      console.error(e);
    }
  }
}
