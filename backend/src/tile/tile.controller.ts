import { Controller, Get, Post, Query } from "@nestjs/common";
import { TileService } from "./tile.service";

@Controller("tile")
export class TileController {
  constructor(private readonly tileService: TileService) {}

  @Post("createWorld")
  post(@Query() query){
    try{
      this.tileService.generateWorld();
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
