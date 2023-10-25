// gameloop.module.ts
import { Module } from '@nestjs/common';
import { GameloopService } from './gameloop.service';
import { TileService } from 'src/tile/tile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from 'src/tile/tile.entity';
import { DecisionEntity } from 'src/decisions/decisions.entity';
import { DecisionService } from 'src/decisions/decisions.service';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity, DecisionEntity])],
  providers: [GameloopService, TileService, DecisionService],
})
export class GameloopModule {}
