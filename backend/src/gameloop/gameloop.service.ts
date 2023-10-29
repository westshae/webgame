import { Injectable } from '@nestjs/common';
import { DecisionService } from 'src/decisions/decisions.service';
import { TileService } from 'src/tile/tile.service';

@Injectable()
export class GameloopService {
  constructor(private readonly tileService: TileService, private readonly decisionService: DecisionService) {}

  startGameloop(){
    const intervalInMilliseconds = 15000;
    setInterval(() => {
      this.tick();
    }, intervalInMilliseconds);
  }

  tick() {
    // Implement your logic here
    this.tileService.updateTilePopulation(10);
    this.decisionService.addDecisionToQueue("question");
    console.log('Service logic executed every 15 seconds');
  }
}
