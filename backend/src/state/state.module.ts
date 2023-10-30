import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileService } from 'src/tile/tile.service';
import { TileEntity } from 'src/tile/tile.entity';
import { StateEntity } from './state.entity';
import { StateService } from './state.service';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity, TileEntity])],
  providers: [StateService, TileService]
})
export class StateModule {}