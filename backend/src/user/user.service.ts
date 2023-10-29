import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import "dotenv/config";
import { TileService } from "src/tile/tile.service";
import { response } from "express";

@Injectable()
export class UserService {
  constructor(private readonly tileService: TileService) {}

  @InjectRepository(UserEntity)
  private readonly userRepo: Repository<UserEntity>;

  async initUser(userId: number) {
    const userExists = await this.doesUserExist(userId);
    if (!userExists) {
      const tile = await this.tileService.getRandomCapitalTile(userId);
      this.userRepo.insert({
        id: userId,
        capitalId: tile.id,
      });
    }
  }

  async doesUserExist(userId: number) {
    const response = await this.userRepo.findOne(userId);
    return response !== undefined;
  }
}
