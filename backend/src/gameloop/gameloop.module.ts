// gameloop.module.ts
import { Module } from '@nestjs/common';
import { GameloopService } from './gameloop.service';
import { TileService } from 'src/tile/tile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from 'src/tile/tile.entity';
import { DecisionEntity } from 'src/decisions/decisions.entity';
import { DecisionService } from 'src/decisions/decisions.service';
import { GameloopController } from './gameloop.controller';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity, DecisionEntity])],
  controllers: [GameloopController],
  providers: [GameloopService, TileService, DecisionService],
})
export class GameloopModule {}
