import { Controller, Get, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("get")
  get(@Query() query){
    try{
      let email = query.email;
      if(!this.authService.checkEmail(email)) return false;
      return this.authService.sendCode(email);
    }catch(e){
      console.error(e);
    }
  }
  @Get("checkcode")
  async checkCode(@Query() query){
    try{
      let email = query.email;
      let code = query.code;
      if(!this.authService.checkEmail(email) || !this.checkCode(code)) return false;
      return await this.authService.checkCode(email,code);
    }catch(e){
      console.error(e);
    }
  }

  @Get("isUserAdmin")
  async isUserAdmin(@Query() query){
    try{
      let email = query.email;
      return await this.authService.isUserAdmin(email);
    }catch(e){
      console.error(e);
    }
  }
}
