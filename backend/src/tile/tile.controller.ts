import { Controller, Get, Post, Query } from "@nestjs/common";
import { TileService } from "./tile.service";
@Controller("tile")
export class TileController {
  constructor(private readonly tileService: TileService) {}
  @Get("getWorld")
  async get(@Query() query){
    try{
      return await this.tileService.loadWorld();
    }catch(e){
      console.error(e);
    }
  }
}
