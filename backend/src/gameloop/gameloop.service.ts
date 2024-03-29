import { Injectable, OnModuleInit } from '@nestjs/common';
import { StateService } from 'src/state/state.service';
import { TileService } from 'src/tile/tile.service';

@Injectable()
export class GameloopService implements OnModuleInit {
  constructor(private readonly tileService: TileService, private readonly stateService: StateService) {}
  onModuleInit() {
    this.emptyRepos();
    this.tileService.generateWorld(16).then(()=>{
      this.stateService.initStates(16);
    })
    this.initLoop(5);
  }

  emptyRepos(){
    this.tileService.deleteAllTiles()
    this.stateService.deleteAllStates();
  }

  initLoop(seconds:number){
    setInterval(() => {
      this.tick();
    }, seconds*1000);
  }

  tick() {
    try{
      this.stateService.addDecisionToAllStates();
      this.stateService.tickAllStateDecisions();
      this.stateService.tickAllStateLogic();  
    } catch (e){
      console.error(e);
    }
  }
}
