export class Tile {
  id: number;
  x: number;
  y: number;
  population: number;

  constructor(id: number, x: number, y: number, population: number) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.population = population;
  }
}