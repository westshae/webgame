import { Injectable, OnModuleInit } from '@nestjs/common';
import { DecisionService } from 'src/decisions/decisions.service';
import { StateService } from 'src/state/state.service';
import { TileService } from 'src/tile/tile.service';

@Injectable()
export class GameloopService implements OnModuleInit {
  constructor(private readonly tileService: TileService, private readonly decisionService: DecisionService, private readonly stateService: StateService) {}
  onModuleInit() {
    this.emptyRepos();
    this.tileService.generateWorld(16).then(()=>{
      this.stateService.initStates(20);
    })
    this.initLoop(15);
  }

  emptyRepos(){
    this.tileService.deleteAllTiles()
    this.decisionService.deleteAllDecisions()
    this.stateService.deleteAllStates();
  }

  initLoop(seconds:number){
    setInterval(() => {
      this.tick();
    }, seconds*1000);
  }

  tick() {
    this.tileService.updateTilePopulation(10);
    this.decisionService.addDecisionToQueue("question");
  }
}
