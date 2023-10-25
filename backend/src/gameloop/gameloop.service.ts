import { Injectable, OnModuleInit } from '@nestjs/common';
import { DecisionService } from 'src/decisions/decisions.service';
import { TileService } from 'src/tile/tile.service';

@Injectable()
export class GameloopService implements OnModuleInit {
  constructor(private readonly tileService: TileService, private readonly decisionService: DecisionService) {}


  onModuleInit() {
    // Run a function every 15 seconds
    const intervalInMilliseconds = 5000; // 15 seconds
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
