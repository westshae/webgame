import { game } from "../..";

class Data {
  lumber: number;
  stone: number;
  metal: number;
  experience: number;
  level: number;
  turn: number;

  constructor() {
    this.lumber = 0;
    this.stone = 0;
    this.metal = 0;
    this.experience = 0;
    this.level = 0;
    this.turn = 0;
  }

  changeResource(resourceID: number, amount: number, increase: boolean) {
    switch (resourceID) {
      case 0:
        this.lumber += amount * (increase ? 1 : -1);
        break;
      case 1:
        this.stone += amount * (increase ? 1 : -1);
        break;

      case 2:
        this.metal += amount * (increase ? 1 : -1);
        break;

      case 3:
        this.experience += amount * (increase ? 1 : -1);
        break;

      case 4:
        this.level += amount * (increase ? 1 : -1);
        break;

      case 5:
        this.turn += amount * (increase ? 1 : -1);
        break;
      case 6:
        //giveItem, nothing else
        break;
    }
    game.hud.drawInformation();
  }
}

export { Data };
