import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import "dotenv/config";
import { TileService } from "src/tile/tile.service";

@Injectable()
export class UserService {
  constructor(private readonly tileService: TileService) {}

  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;
  
  initUser(userId:number){
    if(!this.doesUserExist(userId)){
      this.tileService.getRandomCapitalTile(userId).then((response)=>{
        this.userRepo.insert({
          id:userId,
          capitalId: response.id
         });  
      })
    }
  }

  async doesUserExist(userId: number){
    let entity = await this.userRepo.findOne(userId);
    return (entity != null);
  }
}
