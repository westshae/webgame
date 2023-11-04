import { Module } from '@nestjs/common';
import { GameloopService } from './gameloop.service';
import { TileService } from 'src/tile/tile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from 'src/tile/tile.entity';
import { StateService } from 'src/state/state.service';
import { StateEntity } from 'src/state/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity, StateEntity])],
  providers: [GameloopService, TileService, StateService],
})
export class GameloopModule {}
