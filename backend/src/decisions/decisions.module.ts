import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecisionEntity } from './decisions.entity';
import { DecisionService } from './decisions.service';
import { DecisionController } from './decisions.controller';
import { TileService } from 'src/tile/tile.service';
import { TileEntity } from 'src/tile/tile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DecisionEntity, TileEntity])],
  controllers: [DecisionController],
  providers: [DecisionService, TileService]
})
export class DecisionModule {}