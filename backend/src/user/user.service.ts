import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import "dotenv/config";

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;
  
  initUser(userId:number){
    if(!this.doesUserExist(userId)){
      this.userRepo.insert({
        id:userId,
        hasCapital: false,
       });
    }
  }

  async doesUserExist(userId: number){
    let entity = await this.userRepo.findOne(userId);
    return (entity != null);
  }
}
