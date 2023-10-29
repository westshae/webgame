import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TileService } from 'src/tile/tile.service';
import { TileEntity } from 'src/tile/tile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TileEntity])],
  controllers: [UserController],
  providers: [UserService, TileService]
})
export class UserModule {}