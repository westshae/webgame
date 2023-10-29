export class Tile {
  id: number;
  x: number;
  y: number;
  population: number;
  biome: string;
  farmland: number;
  farmlandUtilized: number;
  ownerUserId: number | null;

  constructor(id: number, x: number, y: number, population: number, biome: string, farmland: number, farmlandUtilized: number, ownerUserId: number | null) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.population = population;
      this.biome = biome;
      this.farmland = farmland;
      this.farmlandUtilized = farmlandUtilized;
      this.ownerUserId = ownerUserId;
  }
}