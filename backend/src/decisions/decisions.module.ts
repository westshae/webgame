import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecisionEntity } from './decisions.entity';
import { DecisionService } from './decisions.service';
import { DecisionController } from './decisions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DecisionEntity])],
  controllers: [DecisionController],
  providers: [DecisionService]
})
export class DecisionModule {}