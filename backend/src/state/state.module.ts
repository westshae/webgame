import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TileService } from 'src/tile/tile.service';
import { TileEntity } from 'src/tile/tile.entity';
import { StateEntity } from './state.entity';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthEntity } from 'src/auth/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StateEntity, TileEntity, AuthEntity])],
  controllers: [StateController],
  providers: [StateService, TileService, AuthService]
})
export class StateModule {}