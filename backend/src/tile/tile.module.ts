import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from './tile.entity';
import { TileService } from './tile.service';
import { StateEntity } from 'src/state/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity, StateEntity])],
  providers: [TileService]
})
export class TileModule {}