export class Tile {
  id: number;
  x: number;
  y: number;
  q: number;
  connectedTiles: number[];
  population: number;
  biome: string;
  farmland: number;
  farmlandUtilized: number;
  ownerUserId: number | null;

  constructor(id: number, x: number, y: number, q: number, connectedTiles:number[], population: number, biome: string, farmland: number, farmlandUtilized: number, ownerUserId: number | null) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.q = q;
      this.connectedTiles = connectedTiles;
      this.population = population;
      this.biome = biome;
      this.farmland = farmland;
      this.farmlandUtilized = farmlandUtilized;
      this.ownerUserId = ownerUserId;
  }
}