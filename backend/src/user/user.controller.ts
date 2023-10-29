import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("initUser")
  async initUser(@Body() data: { userId: number }){
    try{
      return await this.userService.initUser(data.userId);
    }catch(e){
      console.error(e);
    }
  }

}
