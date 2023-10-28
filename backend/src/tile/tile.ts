export class Tile {
  id: number;
  x: number;
  y: number;
  population: number;
  biome: number;
  farmland: number;
  farmlandUtilized: number;

  constructor(id: number, x: number, y: number, population: number, biome: number, farmland: number, farmlandUtilized: number) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.population = population;
      this.biome = biome;
      this.farmland = farmland;
      this.farmlandUtilized = farmlandUtilized;
  }
}