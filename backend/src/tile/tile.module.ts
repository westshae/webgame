import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileEntity } from './tile.entity';
import { TileService } from './tile.service';
import { TileController } from './tile.controller';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([TileEntity, UserEntity])],
  controllers: [TileController],
  providers: [TileService]
})
export class TileModule {}