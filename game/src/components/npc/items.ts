import { Sprite } from 'pixi.js';

interface itemInterface {
  id: number;
  name: string;
  sprite: Sprite;
  buffList: Array<buffInterface>;
}

interface buffInterface {
  statID: number;
  amount: number;
}

let recentID = 0;

class Items {
  id: number;

  constructor() {
    recentID++;
    this.id = recentID;
  }
}

export { itemInterface, buffInterface, Items };
