// gameloop.module.ts
import { Module } from '@nestjs/common';
import { GameloopService } from './gameloop.service';
import { TileService } from 'src/tile/tile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from 'src/tile/tile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity])],
  providers: [GameloopService, TileService],
})
export class GameloopModule {}
