import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from './tile.entity';
import { TileService } from './tile.service';
import { TileController } from './tile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity])],
  controllers: [TileController],
  providers: [TileService]
})
export class TileModule {}