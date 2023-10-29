import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("doesUserExist")
  async get(@Query('userId') userId){
    try{
      return await this.userService.doesUserExist(userId);
    }catch(e){
      console.error(e);
    }
  }

}
