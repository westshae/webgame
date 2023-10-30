// gameloop.module.ts
import { Module } from '@nestjs/common';
import { GameloopService } from './gameloop.service';
import { TileService } from 'src/tile/tile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from 'src/tile/tile.entity';
import { DecisionEntity } from 'src/decisions/decisions.entity';
import { DecisionService } from 'src/decisions/decisions.service';
import { StateService } from 'src/state/state.service';
import { StateEntity } from 'src/state/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity, DecisionEntity, StateEntity])],
  providers: [GameloopService, TileService, DecisionService, StateService],
})
export class GameloopModule {}
