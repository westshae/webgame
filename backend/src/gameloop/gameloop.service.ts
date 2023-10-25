import { Injectable, OnModuleInit } from '@nestjs/common';
import { TileService } from 'src/tile/tile.service';

@Injectable()
export class GameloopService implements OnModuleInit {
  constructor(private readonly tileService: TileService) {}

  onModuleInit() {
    // Run a function every 15 seconds
    const intervalInMilliseconds = 5000; // 15 seconds
    setInterval(() => {
      this.myFunction();
    }, intervalInMilliseconds);
  }

  myFunction() {
    // Implement your logic here
    this.tileService.updateTilePopulation(10);
    console.log('Service logic executed every 15 seconds');
  }
}
