import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import "dotenv/config";

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;
  
  async doesUserExist(userID: number){
    let entity = await this.userRepo.findOne(userID);
    return (entity != null);
  }
}
